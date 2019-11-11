import React, { Component } from 'react';
import { Text,TextInput, View, Dimensions,ScrollView,TouchableOpacity,PermissionsAndroid, Platform } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base'
import CameraRoll from "@react-native-community/cameraroll";//https://github.com/react-native-community/react-native-camera/blob/master/docs/installation.md#mostly-automatic-install-with-cocoapods
import FeatherIcon from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import Ionicon from 'react-native-vector-icons/Ionicons';
//import fs from "react-native-fs";
//import { decode } from "base64-arraybuffer";
//import {RNFetchBlob} from "react-native-fetch-blob"
import { fonts,colors } from '../../config/constants'
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

export default class PostVideoScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
                    url_video:'',
                    paused: true,
                    boostOption:false,
                    saveVideo:false,
                    allowComment:false,
                    postOnFacebook:false,
                    postOnIGstory:false,
                    postOnIGpost:false,
                    postOnTwitter:false
                }
}

  goBack(){
    this.props.navigation.replace('Camera');
}

goForward(){
    console.log("its supposed to navigate through profile screen... (working on that...)");
    this.props.navigation.replace('Profile');
}

async componentDidMount(){
    let url_video = await AsyncStorage.getItem('videoToPost');
    this.setState({url_video,paused:false});
}

async postVideo(){
    let {url_video} = this.state;

    if (Platform.OS === 'android'){
        await checkAndroidPermission();
      }
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
     
    //let base64 = await fs.readFile(url_video, "base64");               
    //let videoObject = decode(base64);
/*
    console.log(`About to save ${url_video} into cameraRoll...`);
      
    RNFetchBlob
    .config({
        fileCache : true,
        appendExt : 'mp4'
    })
    .fetch('GET',url_video)
        .then((res) => {
            CameraRoll.saveToCameraRoll(res.path())
                .then(()=>console.log("stored successfully"))
                .catch(err => console.warn(err))
        })
*/
    /*
    let result = await CameraRoll.saveToCameraRoll(url_video,"video");
    if(result)
        console.log("success!!");
    else
        console.warn("Error!!");                                  
    */
}

    render() {
      return(
        <Container style={{flex: 1,flexDirection: 'column'}}>
            {
                //********HEADER*********** */
            }
            <View style={{flexDirection: "row",
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          borderBottomWidth: 1,
                          borderBottomColor:'rgba(0, 0, 0, 0.1)',
                            }}>
                <View style={{padding:10}}>
                  <Ionicon name="md-arrow-back" style={{
                      fontFamily:fonts.OPENSANS_BOLD,
                      fontSize: 30, 
                      color:colors.MAIN,
                  }} onPress={()=> this.goBack()} />
                </View>
                <View style={{paddingLeft:(width*0.30)}}>
                    <Text style={{fontFamily:fonts.OPENSANS_SEMI_BOLD,fontSize:16,color:'#2F2F2F'}}> New Video </Text>
                </View>
            </View>
            {
                //*****VIDEO POSTING******** */
            }
            <View style={{flexDirection: "row",
                          justifyContent: 'flex-start',
                          padding:10
                          }}>
                <View style={{padding:10,paddingBottom:0,paddingTop:0,alignSelf:'center'}}>
                    {this.state.url_video?
                        <Video
                            source={{ uri: this.state.url_video }} // Can be a URL or a local file.
                            repeat
                            resizeMode={'cover'}
                            paused={this.state.paused}
                            style={{width: (width * 0.23),
                                    height: (height * 0.25),
                                    paddingRight:10,
                                }}
                        />
                        :null}
                </View>
                <View style={{borderWidth:1,
                              borderColor:'rgba(0, 0, 0, 0.01)',
                              paddingLeft:20,
                              width:(width*0.6)
                             }}>
                    <TextInput style={{alignSelf:'center',color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}
                               autoCapitalize='sentences'
                               multiline={true}
                               maxLength={50}
                               textAlignVertical='bottom'
                               numberOfLines={3}
                    >Write a caption here!...(50 Max). This is a long caption, to test thwe maxLength.
                    </TextInput>
                </View>
            </View>
            {
                //********BOOSTING********* */
            }
            <View style={{flexDirection: "row",
                          justifyContent: 'space-between',
                          paddingHorizontal:20,
                          paddingBottom:10,
                          borderBottomWidth:1,
                          borderBottomColor:'rgba(0, 0, 0, 0.05)',
                          paddingTop:10
                          }}>
                <View style={{flexDirection: "row"}}>
                    <FeatherIcon name="zap" size={15} color={colors.MAIN} style={{paddingTop:2}} />
                    <Text style={{color:colors.MAIN,paddingLeft:5,fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}} >
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
            <View style={{paddingHorizontal:20,
                          paddingBottom:10,
                          paddingTop:10,
                          paddingBottom:20}}>
                <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_SEMI_BOLD,fontSize:16}}>
                    Settings
                </Text>
            </View>
            <View style={{flexDirection: "row",
                          justifyContent: 'space-between',
                          paddingHorizontal:20,
                          paddingBottom:15
                          }}>
                <View>
                <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}>
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
            <View style={{flexDirection: "row",
                          justifyContent: 'space-between',
                          paddingHorizontal:20,
                          paddingBottom:25,
                          borderBottomWidth:1,
                          borderBottomColor:'rgba(0, 0, 0, 0.05)',
                          }}>
                <View>
                    <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}>
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
            <View style={{paddingHorizontal:20,
                          paddingBottom:10,
                          paddingTop:10,
                          paddingBottom:20}}>
                <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_SEMI_BOLD,fontSize:16}}>
                    Share
                </Text>
            </View>
            <ScrollView>
                <View style={{flexDirection: "row",
                            justifyContent: 'space-between',
                            paddingHorizontal:20,
                            paddingBottom:15
                            }}>
                    <View>
                    <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}>
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
                <View style={{flexDirection: "row",
                            justifyContent: 'space-between',
                            paddingHorizontal:20,
                            paddingBottom:15
                            }}>
                    <View>
                    <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}>
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
                <View style={{flexDirection: "row",
                            justifyContent: 'space-between',
                            paddingHorizontal:20,
                            paddingBottom:15
                            }}>
                    <View>
                    <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}>
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
                <View style={{flexDirection: "row",
                            justifyContent: 'space-between',
                            paddingHorizontal:20,
                            paddingBottom:15
                            }}>
                    <View>
                    <Text style={{color:'#5F5F5F',fontFamily:fonts.OPENSANS_REGULAR,fontSize:16}}>
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
            <TouchableOpacity style={{
                                        flex: 0,
                                        backgroundColor: colors.MAIN,
                                        borderRadius: 6,
                                        padding: 10,
                                        paddingHorizontal: 14,
                                        alignSelf: 'center',
                                        margin: 10,
                                        width: (width * 0.80),
                                        height: (height * 0.08)
                                    }}
                              onPress={()=>this.postVideo()}
            >
                <View style={{alignSelf:'center',paddingTop:4}}>
                    <Text style={{fontFamily:fonts.OPENSANS_BOLD,color:'white',fontSize:19}}>
                        Post Video
                    </Text>
                </View>
            </TouchableOpacity>
        </Container>
      );
    }
  }