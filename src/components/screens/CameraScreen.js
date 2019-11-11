'use strict';
import React, { Component } from 'react';
import { Text, TouchableOpacity,TouchableWithoutFeedback, View, ActivityIndicator,Dimensions,SafeAreaView,PermissionsAndroid } from 'react-native';
import { Container} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera'//https://github.com/react-native-community/react-native-cameraroll //https://facebook.github.io/react-native/docs/linking-libraries-ios
//https://snowball.digital/blog/switch-between-front-and-back-camera-in-react-native
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CameraRoll from "@react-native-community/cameraroll";//https://medium.com/react-native-training/mastering-the-camera-roll-in-react-native-13b3b1963a2d
import * as Progress from 'react-native-progress';
import { Header } from 'react-navigation-stack';
import { fonts,colors } from '../../config/constants'
import { cameraStyle } from '../../assets/styles/cameraStyle';
//the ones bellow are just for testing purpose
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import { WebIdentityCredentials } from 'aws-sdk';

const { height, width } = Dimensions.get('window');

const checkAndroidPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    await PermissionsAndroid.request(permission);
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

const aws = require('aws-sdk');
//https://stackoverflow.com/questions/56682109/react-native-through-upload-image-on-s3-bucket-using-aws-sdk
const AWS_KEY_ID = "AKIA6AVSWAXFK2AWBAFH";
const AWS_SECRET_KEY = "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";
const AWS_S3_BUCKET = "s3-hilton-videos-test";
const AWS_REGION = "us-west-2"

aws.config.update({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY
});

const s3 = new aws.S3();
export default class CameraScreen extends Component {
        state = {
          recording: false,
          progress: 0,//between 0.0 and 1.0 
          animationId: 0,
          processing: false,
          pause:false,
          continue:false,
          isSavingVideo:true,
          cameraType : 'back',
          mirrorMode : false
        };

  goBack(){
    console.log("go back.....");
    this.props.navigation.goBack(null);
  }

  async startRecording() {
      this.animateProgress();
      if(this.state.pause){
        this.resumeRecording();
        return;
      }
      /*******************remove this later, this bellow is just for testing purpose**************************/
      if(this.state.recording){
        console.log("camera is already initiated...");
        return;
      }
        
      this.setState({ recording: true });
      try{
        const { uri, codec = "mp4" } = await this.camera.recordAsync();  

        if(!this.state.isSavingVideo){
          console.log("we're not saving anything");
          return;
        }
        console.log("----------------------------------------------------");
        console.log(" video :  "+uri);
        console.log("----------------------------------------------------");
        await AsyncStorage.setItem('videoToPost', uri);
        this.setState({ recording: false});
        const type = `video/${codec}`;
        //const data = new FormData();
        /*data.append("video", {
                                name: "mobile-video-upload",
                                type,
                                uri
                              });*/

        let uri_elements = uri.split("/");// "file:///data/user/0/com.hilton/cache/Camera/58ef942a-2870-4a1f-90d7-b9bf38e2c497.mp4"
        let video = uri_elements[uri_elements.length -1];
        let base64 = await fs.readFile(uri, "base64");               
        let videoObject = decode(base64);

        let params = {
                      Bucket: AWS_S3_BUCKET,
                      Body : videoObject,//video object
                      Key : video, //video-name.mp4 (example: 58ef942a-2870-4a1f-90d7-b9bf38e2c497.mp4)
                      ContentType: type,
                      ContentDisposition: 'attachment'
                    };
		//s3.getSignedUrl('putObject', params);
		/*
    s3.upload(params, 
            (err, data) => {
                              if (err) 
                                console.warn("Error : ", err);
                              
                              if (data) 
                                console.log("Uploaded in : ", data.Location);
                            });
    */                      
        /*await fetch(ENDPOINT, {
                                method: "post",
                                body: data
                              });*/                              
        
        this.setState({ processing: false });
        
      }catch(err){
        console.warn(err);
      }
  }
  
stopRecording() {
      if(this.state.recording){
        this.stopProgress();
        this.camera.stopRecording();
        this.setState({recording:0})
        console.log("stop recording....");
      }
      
  }       

pauseRecording() {
    if(this.state.recording && !this.state.pause && this.state.progress<99){
      this.stopProgress();
      this.setState({pause : true});
      //this.camera.pausePreview();
      console.log("pause recording....");
    }
    if(this.state.progress>99)
      this.stopRecording();
  }    
resumeRecording() {
    if(this.state.recording && this.state.pause){
      this.setState({pause : false});
      //this.camera.resumePreview();
      console.log("resume recording....");
    }
  }      

  animateProgress(){
    console.log("start animation progress...");
    if(this.state.progress>99)
      this.setState({progress : 0});

    //if(!this.state.progress>0)//solo cuando sea cero
    //  this.setState({ indeterminate: false });

    let animationId = setInterval(()=>{
                              if(this.state.progress>99){
                                //this.stopRecording();
                                this.stopProgress();
                              }
                              this.setState({progress : this.state.progress + 1});
                            },83)//83 milliseconds
    this.setState({animationId});
  }

  stopProgress(){
    console.log("stop animation progress...");
    clearInterval(this.state.animationId);
  }

  async compileVideo(){
      let is_any_video = await AsyncStorage.getItem('videoToPost');
      if(is_any_video){
        console.log("Compiling Video....");
        this.setState({processing:true})
        let counter = 0;
        let ID = setInterval(()=>counter++,50)
        setTimeout(()=>{clearInterval(ID)
                        this.setState({continue:true,processing:false
                        })},2000)
      }
      
  }

  redoVideo(){
    console.log("Retake the video...");
    this.setState({progress: 0,
                   isSavingVideo:false,
                   continue: false})
    this.stopRecording();
  }

  keepVideo(){
    console.log("This option is in building....");
  }

  flipCamera(){
    if (this.state.cameraType === 'back') 
      this.setState({cameraType: 'front',mirror: true});
     else 
      this.setState({cameraType: 'back',mirror: false});
    
  }

  continueToPost(){
    if(this.state.continue)
      this.props.navigation.replace('PostVideo');
    else
      console.log("nothing to save or post");
  }

 async getVideosRoll(){
    if (Platform.OS === 'android'){
      await checkAndroidPermission();
    }
    CameraRoll.getPhotos({
      first: 10,
      groupTypes:'All',
      assetType:'Videos'
    })
    .then(r => console.log("it works!"))
    .catch(e => console.warn(e))
  }

  render() {
    return (
      
      <Container style={cameraStyle.container}>
        <RNCamera
            ref={ref => {this.camera = ref}}
            style={cameraStyle.preview}
            //type={RNCamera.Constants.Type.back}
            type={this.state.cameraType} 
            mirrorImage={this.state.mirrorMode}
            flashMode={RNCamera.Constants.FlashMode.on}>
        
        <SafeAreaView style={cameraStyle.safeArea}>

          <View style={cameraStyle.progressStatus}>
                <View style={{padding:10, 
                              alignSelf:'center',
                              opacity:(this.state.progress? 1:0) 
                              }}
                >
                  <Progress.Bar animated={true}
                                //indeterminate={this.state.indeterminate}
                                progress={(this.state.progress/100)} 
                                height={6} 
                                width={width*0.80} 
                                color={'rgba(108,92,231, 0.8)'}
                                borderWidth={0.5} />
                </View>

                <View style={{flexDirection: "row",
                              //alignSelf:'center',
                              justifyContent: 'space-between',
                              paddingHorizontal:35,
                              
                          }}>
                <View>
                  <Ionicon name="md-arrow-back" style={cameraStyle.goBack} onPress={()=> this.goBack()} />
                </View>

                <View>
                  <AntIcon name="retweet" style={cameraStyle.goBack} onPress={()=> this.flipCamera()} />
                  <Text style={{fontSize:10,fontFamily:fonts.OPENSANS_REGULAR,color:'white',alignSelf:'center'}} >Flip</Text>
                </View>

            </View>

          </View>
          <View style={{flexDirection:'row',
          //justifyContent: 'space-between'
        }}>
              <View style={{
                justifyContent:'flex-end',
                //paddingBottom:60,
                paddingLeft:25,
                paddingBottom:(width*0.2)
                }}>
                  <View >
                    <Ionicon name="md-photos" style={[cameraStyle.goBack,{alignSelf:'center'}]} onPress={()=> this.getVideosRoll()} />
                  <Text style={{fontSize:10,fontFamily:fonts.OPENSANS_REGULAR,color:'white',alignSelf:'center'}} >Upload</Text>
                </View>
            </View>

            <TouchableWithoutFeedback onPressIn={()=>this.startRecording()}//this.animateProgress()
                                        onPressOut={()=>this.stopRecording()}//this.stopProgress()}
                                        >
                  
                    <View style={{alignSelf:'center',
                                  height:(height * 0.9), 
                                  width:(width*0.75), 
                                  //opacity:0.5, 
                                  //backgroundColor:'red'
                                  }}>
                                    {
                                      this.state.processing?
                                      <ActivityIndicator animating color={colors.MAIN} size={50}/>:
                                      null
                                    }
                      </View>
                    
              </TouchableWithoutFeedback>
              
                <View style={{flexDirection:'column',
                justifyContent:'flex-end',
                //paddingBottom:60,
                paddingBottom:(width*0.17),
                paddingRight:25
                }}>

                <TouchableOpacity>
                  <View style={{paddingBottom:15}}>
                    <FeatherIcon name="refresh-ccw" style={cameraStyle.goBack} onPress={()=> this.redoVideo()} />
                    <Text style={{fontSize:10,fontFamily:fonts.OPENSANS_LIGHT,color:'white',alignSelf:'center'}} >Redo</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                <View style={{paddingBottom:15}}>
                    <FeatherIcon name="layers" style={cameraStyle.goBack} onPress={()=> this.compileVideo()} />
                  <Text style={{fontSize:10,fontFamily:fonts.OPENSANS_LIGHT,color:'white',alignSelf:'center'}} >Compile</Text>
                </View>
                </TouchableOpacity>

                <View style={{flexDirection:'column'}}>
                <TouchableOpacity
                  onPress={()=>this.props.navigation.replace('PostVideo')}
                  style={{backgroundColor:colors.MAIN,
                          flex: 0,
                          borderRadius: 75,
                          alignSelf: 'center',
                          padding: 10,
                        }}
                >
                    <View>
                      <FeatherIcon name="check" style={{
                                                        fontFamily:fonts.OPENSANS_LIGHT,
                                                        fontSize: 20, 
                                                        color:'white',
                                                      }} 
                                                      onPress={()=> this.continueToPost()} />
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize:10,fontFamily:fonts.OPENSANS_LIGHT,color:'white',alignSelf:'center'}} >Done</Text>
                </View>

              </View>
          </View>
          </SafeAreaView>
        </RNCamera>
      </Container>
      
    );
  }
  }