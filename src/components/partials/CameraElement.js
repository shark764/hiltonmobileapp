'use strict';
import React, { Component } from 'react';
import { Text, TouchableOpacity,TouchableWithoutFeedback, View, ActivityIndicator,Dimensions,SafeAreaView } from 'react-native';
import {RNCamera} from 'react-native-camera'
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import { fonts,colors } from '../../config/constants'
import { cameraStyle } from '../../assets/styles/cameraStyle';

const { height, width } = Dimensions.get('window');

export default class CameraElement extends Component {
    constructor(props) {
        super(props);
      }

    render(){
        return(
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
        )
    }

}