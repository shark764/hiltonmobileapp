import React, { Component } from 'react';
import {StatusBar,View,Text,StyleSheet,Image,Dimensions,FlatList,ScrollView, TouchableOpacity} from "react-native";
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';//https://oblador.github.io/react-native-vector-icons/
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-community/async-storage';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import { fonts,colors } from '../../config/constants'
import { cameraRollStyle } from '../../assets/styles/cameraRollStyle';

const { height, width } = Dimensions.get('window');

export default class CameraRollView extends Component {
    static navigationOptions = () => ({ title: 'Camera Roll' });

    constructor(props) {
        super(props)

        this.state = {
            cameraRollVideos: []
        }
    }

    

componentDidMount(){
    let elements = JSON.parse(this.props.navigation.getParam('cameraRollItems',[])) || [];
    //console.log(`ComponentDidMount CameraRollView : ${elements}`)
    //console.log(typeof(elements))
    let videos = elements.map((item) => {
        let {playableDuration, filename, uri} = item.node.image;
        let videoName = filename.split(".")
        return {
                playableDuration, 
                filename, 
                uri,
                id : videoName[0]
            }
    })
    //console.log(videos);
    //videos.filter((video) => video.playableDuration>=5)//filter all the videos greater than 5 seconds.
    this.setState({cameraRollVideos: videos})
}

goBack(){
    console.log("go back.....");
    this.props.navigation.goBack(null);
  }

  editThisVideo(url){
      console.log(`About to edit this video : ${url}`);
  }

  renderCameraRollVideos() {
      let {cameraRollVideos = []} = this.state;
      console.log("about to show the videos")
    return cameraRollVideos.map((element,index) => {
                return (
                    <TouchableOpacity key={element.id} onPress={() => this.editThisVideo(element.uri)} >
                        <View key={element.id} style={[{ width: (width) / 3 }, { height: (width) / 2 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                            <Video
                                source={{ uri: element.uri }}
                                repeat
                                //resizeMode={'cover'}
                                paused={false}
                                style={[{ width: (width) / 3 }, { height: (width) / 2 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}
                                onPress={(element)=> this.editThisVideo(element)}
                            />
                        </View>
                    </TouchableOpacity>
                )
            })
}


    render(){
        return(
            <Container style={{flex: 1,flexDirection: 'column'}}>
                {
                    //********HEADER*********** */
                }
                <View style={cameraRollStyle.header}>
                    <View style={{padding:10}}>
                    <Ionicon name="md-arrow-back" style={cameraRollStyle.backIcon} onPress={()=> this.goBack()} />
                    </View>
                    <View style={{paddingLeft:(width*0.30)}}>
                        <Text style={cameraRollStyle.title}> Camera Roll </Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={cameraRollStyle.rowsThumbnails}>
                        { this.state.cameraRollVideos.length?
                            this.renderCameraRollVideos() :null
                        }
                    </View>
                </ScrollView>
            </Container>
        )
    }

}  