'use strict';
import React, { Component } from 'react';
import { Dimensions,PermissionsAndroid } from 'react-native';
import { Container} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import CameraRoll from "@react-native-community/cameraroll";
import { cameraStyle } from '../../assets/styles/cameraStyle';
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import CameraElement from "../partials/CameraElement"
import FeedbackVideo from "../partials/FeedbackVideo"

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
          //cameraType : 'back',
          //mirrorMode : false,
          feedbackSegment:false,//must be false to start
          currentSegment:'',
          videoSegment: []
        };

componentDidMount(){
  this.setState({progress: 0,
                 continue: false,
                 feedbackSegment:false,
                 videoSegment: []
                })
}

  goBack(){
    console.log("go back.....");
    this.stopRecording();
    this.setState({progress: 0,
                   continue: false,
                   feedbackSegment:false,
                   videoSegment: []
                 })
    this.props.navigation.goBack(null);
  }

  showSegments(){
    let {videoSegment} = this.state;
    console.log("----------------------------------------------------");
    videoSegment.map((segment) => console.log(" segment :  "+JSON.stringify(segment)));
    console.log("----------------------------------------------------");
  }

  async startRecording() {
      if(this.state.progress>99)
        return;
      this.animateProgress();
      this.setState({ recording: true });

      try{
        let { uri, codec = "mp4" } = await this.camera.recordAsync();  
        let type = `video/${codec}`;

        this.setState({ recording: false});

        let {videoSegment} = this.state;
        videoSegment.push({segment: this.state.progress,
                           realTime: (this.state.progress>0?((this.state.progress * 9000)/100):0),
                           urlSegment : uri});
        this.setState({videoSegment: videoSegment});
        
        this.getLastSegment();
        this.setState({feedbackSegment : true})

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
        //this.setState({ processing: false })
        
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
    if(this.state.progress>99){
      //this.setState({progress : 0});// we can go back by remove the last section
      this.stopRecording();
      return;
    }
    let animationId = setInterval(()=>{
                              if(this.state.progress>99){
                                //this.setState({progress : 0});// we can go back by remove the last section
                                this.stopRecording();
                              }
                              this.setState({progress : this.state.progress + 1});
                            },(MAX_VIDEO_SIZE / 100))//with step of 1%
    this.setState({animationId});
  }

 compileVideo(){
      let {videoSegment = [] , progress} = this.state;
      console.log("Compiling Video....");
      if(progress<=(MAX_VIDEO_SIZE / 100))//it means at least 5 seconds of the current record.
        this.setState({feedbackSegment : false})
      else
        this.setState({continue : true})
      
  }

  redoVideo(){
    let {videoSegment} = this.state;
    console.log("Retake the last section of the video...");
    if(videoSegment.length>0){
      videoSegment.pop();//removing the last video
      if(videoSegment.length===0)
        this.setState({progress: 0,
                       continue: false})
      else{
        let last_segment = videoSegment[videoSegment.length -1];
        this.setState({progress: last_segment.segment})
        if(last_segment.segment<(MIN_VIDEO_SIZE / 100))
          this.setState({continue: false});
      }
    }
    this.setState({feedbackSegment : false})
    this.showSegments();
  }

  flipCamera(){
    if (this.state.cameraType === 'back') 
      this.setState({cameraType: 'front',mirrorMode: true});
     else 
      this.setState({cameraType: 'back',mirrorMode: false});
    
  }

  async continueToPost(){
    if(this.state.continue){
        //---------------> need to send all the videos to the endpoint to start processing and join all the splitted videos
        await AsyncStorage.setItem('videoToPost', JSON.stringify(this.state.videoSegment));
      this.props.navigation.push('PostVideo');
    }else
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
    .then((data) => {
                      //console.log("it works....");
                      //console.log(`The data is : ${JSON.stringify(data.edges)}`)
                      this.props.navigation.push('CameraRoll',{cameraRollItems: JSON.stringify(data.edges)})
                      //this.props.navigation.navigate('CameraRoll',{cameraRollItems: JSON.stringify(data.edges)})
                    })
    .catch(e => console.warn(e))
  }

  setCameraReference(ref){
    this.camera = ref;
  }

  getLastSegment(){
    let {videoSegment = []} = this.state;
    if(videoSegment.length){
      let lastSegment = videoSegment[videoSegment.length - 1];
      console.log(`Current Segment : ${lastSegment.urlSegment}`);
      this.setState({currentSegment : lastSegment.urlSegment});
    }
      
  }

  render() {
    return (
      
      <Container style={cameraStyle.container}>
        {
          !this.state.feedbackSegment?
            <CameraElement 
            reference={(ref)=>{this.setCameraReference(ref)}}
            progress={this.state.progress}
            goBack={()=>this.goBack()}
            flipCamera={()=>this.flipCamera()}
            getVideosRoll={()=>this.getVideosRoll()}//TODO: actually isn't working...
            startRecording={()=>this.startRecording()}
            stopRecording={()=>this.stopRecording()}
            videoSegments={this.state.videoSegment}
            redoVideo={()=>this.redoVideo()}
            compileVideo={()=>this.compileVideo()}
            continue={this.state.continue}
            continueToPost={()=>this.continueToPost()}
            processing={this.state.processing}
            compile={this.state.progress>=(MIN_VIDEO_SIZE / 100)? 1:0}
          />:
          <FeedbackVideo 
            source={this.state.currentSegment}
            goBack={()=>this.goBack()}
            arraySegments={this.state.videoSegment}
            redoVideo={()=>this.redoVideo()}
            compileVideo={()=>this.compileVideo()}
            continueToPost={()=>this.continueToPost()}
            continue={this.state.continue}
          />
        }
      </Container>
      
    );
  }
  }