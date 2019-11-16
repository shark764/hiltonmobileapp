'use strict';
import React, { Component } from 'react';
import { Text, TouchableOpacity,TouchableWithoutFeedback, View, ActivityIndicator,Dimensions,SafeAreaView,PermissionsAndroid } from 'react-native';
import { Container} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera'
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CameraRoll from "@react-native-community/cameraroll";
import * as Progress from 'react-native-progress';
import { fonts,colors } from '../../config/constants'
import { cameraStyle } from '../../assets/styles/cameraStyle';
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";

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

const ENDPOINT = 'http://ec2co-ecsel-e7kzz6bjzpwo-1247028944.us-east-2.elb.amazonaws.com/video';
const MAX_VIDEO_SIZE = 9000;
const MIN_VIDEO_SIZE = 5000;
export default class CameraScreen extends Component {
        state = {
          recording: false,
          progress: 0,
          animationId: 0,
          processing: false,
          pause:false,
          continue:false,
          cameraType : 'back',
          mirrorMode : false,
          video_segments: []
        };

componentDidMount(){
  this.setState({progress: 0,
                 continue: false})
}

  goBack(){
    console.log("go back.....");
    this.props.navigation.goBack(null);
  }

  showSegments(){
    let {video_segments} = this.state;
    console.log("----------------------------------------------------");
    video_segments.map((segment) => console.log(" segment :  "+JSON.stringify(segment)));
    console.log("----------------------------------------------------");
  }

  async startRecording() {
      if(this.state.progress>100)
        return;
      this.animateProgress();
      this.setState({ recording: true });

      try{
        let { uri, codec = "mp4" } = await this.camera.recordAsync();  
        let type = `video/${codec}`;

        this.setState({ recording: false});

        let {video_segments} = this.state;
        video_segments.push({segment: this.state.progress,
                             real_time: (this.state.progress>0?((this.state.progress * 9000)/100):0),
                             url_segment : uri});
        this.setState({video_segments: video_segments});
        
        this.showSegments();

        let uri_elements = uri.split("/");// "file:///data/user/0/com.hilton/cache/Camera/58ef942a-2870-4a1f-90d7-b9bf38e2c497.mp4"
        let video = uri_elements[uri_elements.length -1];
        let base64 = await fs.readFile(uri, "base64");               
        let videoObject = decode(base64);
        
        let video_body = {
                          title: video,
                          description: video,
                          duration: 9,
                          id_user: 19,
                          video: videoObject
                        };
      /*
        console.log("about to save the video....");
        fetch(ENDPOINT, {
                        method: "POST",
                        headers: {
                          'Accept': 'application/json, text/plain',
                          'Content-Type': 'multipart/form-data'//, application/json'
                      },
                        body: JSON.stringify(video_body)
                      })
                .then(res => {console.log(`the result is : ${res.status}`); return res.json()})
                .then(res => console.log(res))
                .catch(err => console.warn(err))
        */
        this.setState({ processing: false })
        
      }catch(err){
        console.warn(err);
      }
  }
  
stopRecording() {
      if(this.state.recording){
        clearInterval(this.state.animationId);
        this.camera.stopRecording();
        console.log("stop recording....");
      }
  }            

  animateProgress(){
    console.log("start animation progress...");
    if(this.state.progress>100){
      //this.setState({progress : 0});// we can go back by remove the last section
      this.stopRecording();
      return;
    }
    let animationId = setInterval(()=>{
                              if(this.state.progress>100){
                                //this.setState({progress : 0});// we can go back by remove the last section
                                this.stopRecording();
                              }
                              this.setState({progress : this.state.progress + 1});
                            },(MAX_VIDEO_SIZE / 100))//with step of 1%
    this.setState({animationId});
  }

  async compileVideo(){
      let {video_segments = [] , progress} = this.state;
      if(video_segments.length && progress>=(MIN_VIDEO_SIZE / 100)){//it means at least 5 seconds of the current record.
        console.log("Compiling Video....");
        this.setState({processing:true})
        this.setState({continue:true,processing:false})
        //---------------> need to send all the videos to the endpoint to start processing and join all the splitted videos
        await AsyncStorage.setItem('videoToPost', this.state.video_segments);
      }else{
        console.log("show a tool tip to tell that you must need to record at least a section of 5 seconds");
      }
  }

  redoVideo(){
    let {video_segments} = this.state;
    console.log("Retake the last section of the video...");
    if(video_segments.length>0){
      video_segments.pop();//removing the last video
      if(video_segments.length===0)
        this.setState({progress: 0,
                       continue: false})
      else{
        let last_segment = video_segments[video_segments.length -1];
        this.setState({progress: last_segment.segment})
        if(last_segment.segment>=(MIN_VIDEO_SIZE / 100))
          this.setState({continue: true});
        else
          this.setState({continue: false});
      }
    }
    this.showSegments();
  }

  flipCamera(){
    if (this.state.cameraType === 'back') 
      this.setState({cameraType: 'front',mirror: true});
     else 
      this.setState({cameraType: 'back',mirror: false});
    
  }

  continueToPost(){
    if(this.state.continue)
      this.props.navigation.push('PostVideo');
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
                                progress={(this.state.progress/100)} 
                                height={6} 
                                width={width*0.80} 
                                color={'rgba(108,92,231, 0.8)'}
                                borderWidth={0.5} />
                  
                </View>

                <View style={{flexDirection: "row",
                              justifyContent: 'space-between',
                              paddingHorizontal:35,
                              
                          }}>
                <View>
                  <Ionicon name="md-arrow-back" style={cameraStyle.goBack} onPress={()=> this.goBack()} />
                </View>

                <View>
                  <AntIcon name="retweet" style={cameraStyle.goBack} onPress={()=> this.flipCamera()} />
                  <Text style={cameraStyle.textIcon} >Flip</Text>
                </View>

            </View>

          </View>
          <View style={{flexDirection:'row'}}>
              <View style={{
                justifyContent:'flex-end',
                paddingLeft:25,
                paddingBottom:(width*0.2)
                }}>
                  <View >
                    <Ionicon name="md-photos" style={[cameraStyle.goBack,{alignSelf:'center'}]} onPress={()=> this.getVideosRoll()} />
                  <Text style={cameraStyle.textIcon}>Upload</Text>
                </View>
            </View>

            <TouchableWithoutFeedback onPressIn={()=>this.startRecording()}
                                      onPressOut={()=>this.stopRecording()}
            >
                  
                    <View style={{alignSelf:'center',
                                  height:(height * 0.9), 
                                  width:(width*0.75), 
                                  //opacity:0.5, 
                                  //backgroundColor:'red'
                                  }}
                    >
                                    {
                                      this.state.processing?
                                      <ActivityIndicator animating color={colors.MAIN} size={50}/>:
                                      null
                                    }
                      </View>
                    
            </TouchableWithoutFeedback>
              
                <View style={{flexDirection:'column',
                justifyContent:'flex-end',
                paddingBottom:(width*0.17),
                paddingRight:25
                }}>

                <TouchableOpacity>
                  <View style={{
                    paddingBottom:15,
                    opacity:(this.state.video_segments.length? 1:0)
                    }}>
                    <FeatherIcon name="refresh-ccw" style={cameraStyle.goBack} onPress={()=> this.redoVideo()} />
                    <Text style={cameraStyle.textIcon} >Redo</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                <View style={{paddingBottom:15,
                              opacity:(this.state.progress>=(MIN_VIDEO_SIZE / 100)? 1:0)
                              }}>
                    <FeatherIcon name="layers" style={cameraStyle.goBack} onPress={()=> this.compileVideo()} />
                  <Text style={cameraStyle.textIcon} >Compile</Text>
                </View>
                </TouchableOpacity>

                <View style={{flexDirection:'column',
                              opacity:(this.state.continue? 1:0)}}>
                <TouchableOpacity
                  onPress={()=>this.props.navigation.replace('PostVideo')}
                  style={cameraStyle.circleButton}>
                    <View>
                      <FeatherIcon name="check" style={{
                                                        fontFamily:fonts.OPENSANS_LIGHT,
                                                        fontSize: 20, 
                                                        color:'white',
                                                      }} 
                                                      onPress={()=> this.continueToPost()} />
                    </View>
                </TouchableOpacity>
                <Text style={cameraStyle.textIcon} >Done</Text>
                </View>

              </View>
          </View>
          </SafeAreaView>
        </RNCamera>
      </Container>
      
    );
  }
  }