import { Dimensions } from 'react-native';
import { fonts,colors } from '../../config/constants';

const { height, width } = Dimensions.get('window');

export const cameraStyle = {
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      },
      header: {
        paddingTop: 30, 
        paddingBottom: 10, 
        paddingLeft: 10, 
        backgroundColor: colors.MAIN,
        opacity: 0.5
      },
      preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      capture: {
        flex: 0,
        //backgroundColor: '#fff',
        borderRadius: 75,
        padding: 10,
        paddingHorizontal: 14,
        alignSelf: 'center',
        margin: 5,
        width: 100,
        //height: 10
      },
      progressStatus: {
        flexDirection: "column",
        justifyContent: 'space-between',
        paddingTop: (height * 0.03), 
        //alignItems: 'center',
        opacity:0.85 
      },
      goBack: {
        fontFamily:fonts.OPENSANS_LIGHT,
        fontSize: 30, 
        color:'white', 
        //paddingRight: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 5 
      },
      recordingFeedback:{
        flex:2,
        //paddingTop:(height *0.75), 
        paddingLeft:(width * 0.20),
        flexDirection: "row", 
        justifyContent: "flex-end"
      },
      recordAgain:{
        fontSize: 12, 
        color:'white',
        fontFamily:fonts.OPENSANS_REGULAR,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10 
      },
      buttonText:{
        fontSize: 14,
        fontFamily:fonts.OPENSANS_BOLD,
        //color:colors.MAIN,
        alignSelf:'center'
      },
      safeArea: { flex: 1 },
      textIcon:{
        fontSize:10,
        fontFamily:fonts.OPENSANS_REGULAR,
        color:'white',
        alignSelf:'center'
      },
      circleButton:{
        backgroundColor:colors.MAIN,
        flex: 0,
        borderRadius: 75,
        alignSelf: 'center',
        padding: 10,
      },
      rightMenu:{
        flexDirection:'column',
        justifyContent:'flex-end',
        paddingBottom:(width*0.17),
        paddingRight:25
      }
};