'use strict';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View,Dimensions,SafeAreaView } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { fonts } from '../../config/constants'
import { cameraStyle } from '../../assets/styles/cameraStyle';
import Video from 'react-native-video';

const { height, width } = Dimensions.get('window');

export default class FeedbackVideo extends Component {
    constructor(props) {
        super(props);
      }

      render(){
          return(
            <View>
                <Video 
                style={cameraStyle.feedbackVideo}
                source={{uri : this.props.source}}
                repeat
                resizeMode={'cover'}
                />
                <SafeAreaView style={{
                                    justifyContent: 'space-between',
                                    padding: 20,
                                    flexDirection: 'column'
                                    }}
                >
                {
                    /********************* goBack button **********************/
                }
                    <View style={cameraStyle.progressStatus}>
                        <View style={{flexDirection: "row",
                                      justifyContent: 'space-between',
                                      paddingTop:7,
                                      paddingLeft:4
                                    }}
                        >
                        <View>
                            <Ionicon name="md-arrow-back" style={cameraStyle.goBack} onPress={()=> this.props.goBack()} />
                        </View>
                    </View>
                    </View>
                    {
                    /************** redo / compile(accept) buttons *****************/
                    }
                    <View style={{
                                paddingLeft:(width * 0.80),
                                paddingTop:(height * 0.56), 
                    }}>
                    <TouchableOpacity>
                        <View style={{
                                        paddingBottom:15,
                                        alignItems: 'center',
                        }}>
                        <FeatherIcon name="refresh-ccw" style={cameraStyle.goBack} onPress={()=> this.props.redoVideo()} />
                        <Text style={cameraStyle.textIcon} >Redo</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                    <View style={{paddingBottom:15,
                                    alignItems: 'center',
                                    }}>
                        <FeatherIcon name="layers" style={cameraStyle.goBack} onPress={()=> this.props.compileVideo()} />
                        <Text style={cameraStyle.textIcon} >Compile</Text>
                    </View>
                    </TouchableOpacity>

                    <View style={{flexDirection:'column',
                                  opacity:(this.props.continue? 1:0)
                                    }}>
                    <TouchableOpacity
                        style={cameraStyle.circleButton}>
                        <View>
                            <FeatherIcon name="check" style={{
                                                            fontFamily:fonts.OPENSANS_LIGHT,
                                                            fontSize: 20, 
                                                            color:'white',
                                                            }} 
                                                            onPress={()=> this.props.continueToPost()} />
                        </View>
                    </TouchableOpacity>
                    <Text style={cameraStyle.textIcon} >Done</Text>
                    </View>

                    </View>
                </SafeAreaView>
          </View>
          )
      }

}