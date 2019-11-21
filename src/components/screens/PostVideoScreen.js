import React, { Component } from 'react';
import { Text,TextInput, View, Dimensions,ScrollView,TouchableOpacity,PermissionsAndroid, Platform } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base'
import FeatherIcon from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import Ionicon from 'react-native-vector-icons/Ionicons';
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import { fonts,colors } from '../../config/constants'
const { height, width } = Dimensions.get('window');
import { postStyle } from '../../assets/styles/postStyle';

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

export default class PostVideoScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
                    url_video:'',
                    paused: false,
                    boostOption:false,
                    saveVideo:false,
                    allowComment:false,
                    postOnFacebook:false,
                    postOnIGstory:false,
                    postOnIGpost:false,
                    postOnTwitter:false,
                    description:''
                }
}

  goBack(){
    this.props.navigation.replace('Camera');
}

goForward(){
    console.log("its supposed to navigate through profile screen... (working on that...)");
    this.props.navigation.push('Profile');
}

async componentDidMount(){
    let videoSegment = await AsyncStorage.getItem('videoToPost');
    videoSegment = JSON.parse(videoSegment);
    let lastSegment = videoSegment[videoSegment.length - 1];
    this.setState({url_video : lastSegment.url, paused: false});
    console.log(this.state.url_video)
}

async uploadSegments(){
    let videoSegment = await AsyncStorage.getItem('videoToPost');
    videoSegment = JSON.parse(videoSegment);
    let lastSegment = videoSegment[videoSegment.length - 1];
    let test = null;
    let arrayVideoObjects = [];

    for(let i=0;i<videoSegment.length;i++){
        let segment = videoSegment[i];
        let base64 = await fs.readFile(segment.url, "base64");
        let videoObject = decode(base64);  
        test = videoObject;
        arrayVideoObjects.push(videoObject);
    }
    
    console.log(`--> arrayVideoObject : ${arrayVideoObjects.length}`);
    let { description } = this.state;
    let video_body = {
                      title: description,
                      description: description,
                      duration: lastSegment.realTime/1000,//seconds ? or millis?
                      id_user: 28,
                      video: test //arrayVideoObjects
                    };
  
    console.log("about to save the video....");
    fetch(ENDPOINT, {
                    method: "POST",
                    headers: {
                      'Accept': 'application/json, text/plain',
                      'Content-Type': 'multipart/form-data'
                    },
                    body: JSON.stringify(video_body)
                  })
            .then(res => {console.log(`the result is : ${res.status}`); return res.json()})
            .then(res => console.log(res))
            .catch(err => console.warn(err))
  }

async postVideo(){
    //let {url_video} = this.state;
    await this.uploadSegments();

    if (Platform.OS === 'android'){
        await checkAndroidPermission();
      }
    /*  
    try{
        if(this.state.saveVideo)
            CameraRoll.saveToCameraRoll(url_video,"video")
                .then(()=>this.goForward())
                .catch(err => console.warn(err))
        else
            console.log("you're not going to store anything in camera roll...");
    }catch(error){
        console.warn(error);
    }
    */
   this.goForward();
}

    render() {
      return(
        <Container style={{flex: 1,flexDirection: 'column'}}>
            {
                //********HEADER*********** */
            }
            <View style={postStyle.header}>
                <View style={{padding:10}}>
                  <Ionicon name="md-arrow-back" style={postStyle.backIcon} onPress={()=> this.goBack()} />
                </View>
                <View style={{paddingLeft:(width*0.30)}}>
                    <Text style={postStyle.title}> New Video </Text>
                </View>
            </View>
            {
                //*****VIDEO POSTING******** */
            }
            <View style={postStyle.postFrame}>
                <View style={postStyle.leftSide}>
                    {this.state.url_video?
                        <Video
                            source={{ uri: this.state.url_video }} // Can be a URL or a local file.
                            repeat
                            paused={this.state.paused}
                            style={postStyle.rightSide}
                        />
                        :null}
                </View>
                <View style={postStyle.commentBox}>
                    <TextInput style={postStyle.textStyle}
                               autoCapitalize='sentences'
                               multiline={true}
                               maxLength={39}
                               textAlignVertical='bottom'
                               numberOfLines={3}
                               placeholder='Write a caption here!...(39 Max).'
                               onChangeText={(description) => this.setState({ description })}
                    >
                    </TextInput>
                </View>
            </View>
            {
                //********BOOSTING********* */
            }
            <View style={postStyle.boostRow}>
                <View style={{flexDirection: "row"}}>
                    <FeatherIcon name="zap" size={15} color={colors.MAIN} style={{paddingTop:2}} />
                    <Text style={postStyle.boostText} >
                        Boost Video
                    </Text>
                </View>
                <View>
                    <ToggleSwitch 
                        isOn={this.state.boostOption}
                        onColor='#4CD964'
                        offColor={colors.SOFT_GRAY}
                        onToggle={() => this.setState({boostOption: !this.state.boostOption})}
                    />
                </View>
            </View>
            {
                //******************SETTINGS************************
            }
            <View style={postStyle.subtitleRow}>
                <Text style={postStyle.subtitleText}>
                    Settings
                </Text>
            </View>
            <View style={postStyle.normalRow}>
                <View>
                <Text style={postStyle.itemText}>
                    Save Video
                </Text>
                </View>
                <View>
                    <ToggleSwitch 
                        isOn={this.state.saveVideo}
                        onColor='#4CD964'
                        offColor={colors.SOFT_GRAY}
                        onToggle={() => this.setState({saveVideo: !this.state.saveVideo})}
                    />
                </View>
            </View>
            <View style={postStyle.endRow}>
                <View>
                    <Text style={postStyle.itemText}>
                        Allow Commenting
                    </Text>
                </View>
                <View>
                    <ToggleSwitch 
                        isOn={this.state.allowComment}
                        onColor='#4CD964'
                        offColor={colors.SOFT_GRAY}
                        onToggle={() => this.setState({allowComment: !this.state.allowComment})}
                    />
                </View>
            </View>
            {
                //************SHARE********** */
            }
            <View style={postStyle.subtitleRow}>
                <Text style={postStyle.subtitleText}>
                    Share
                </Text>
            </View>
            <ScrollView>
                <View style={postStyle.normalRow}>
                    <View>
                    <Text style={postStyle.itemText}>
                        Facebook
                    </Text>
                    </View>
                    <View>
                        <ToggleSwitch 
                            isOn={this.state.postOnFacebook}
                            onColor='#4CD964'
                            offColor={colors.SOFT_GRAY}
                            onToggle={() => this.setState({postOnFacebook: !this.state.postOnFacebook})}
                        />
                    </View>
                </View>
                <View style={postStyle.normalRow}>
                    <View>
                    <Text style={postStyle.itemText}>
                        Instagram Story
                    </Text>
                    </View>
                    <View>
                        <ToggleSwitch 
                            isOn={this.state.postOnIGstory}
                            onColor='#4CD964'
                            offColor={colors.SOFT_GRAY}
                            onToggle={() => this.setState({postOnIGstory: !this.state.postOnIGstory})}
                        />
                    </View>
                </View>
                <View style={postStyle.normalRow}>
                    <View>
                    <Text style={postStyle.itemText}>
                        Instagram Post
                    </Text>
                    </View>
                    <View>
                        <ToggleSwitch 
                            isOn={this.state.postOnIGpost}
                            onColor='#4CD964'
                            offColor={colors.SOFT_GRAY}
                            onToggle={() => this.setState({postOnIGpost: !this.state.postOnIGpost})}
                        />
                    </View>
                </View>
                <View style={postStyle.normalRow}>
                    <View>
                    <Text style={postStyle.itemText}>
                        Twitter
                    </Text>
                    </View>
                    <View>
                        <ToggleSwitch 
                            isOn={this.state.postOnTwitter}
                            onColor='#4CD964'
                            offColor={colors.SOFT_GRAY}
                            onToggle={() => this.setState({postOnTwitter: !this.state.postOnTwitter})}
                        />
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={postStyle.postButton}
                              onPress={()=>this.postVideo()}
            >
                <View style={{alignSelf:'center',paddingTop:4}}>
                    <Text style={postStyle.postTextButton}>
                        Post Video
                    </Text>
                </View>
            </TouchableOpacity>
        </Container>
      );
    }
  }