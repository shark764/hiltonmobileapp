import { Dimensions } from 'react-native';
import { fonts,colors } from '../../config/constants';

const { height, width } = Dimensions.get('window');

export const cameraRollStyle = {
    header:{
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor:'rgba(0, 0, 0, 0.1)'
    },
    title:{
        fontFamily:fonts.OPENSANS_SEMI_BOLD,
        fontSize:16,
        color:'#2F2F2F'
    },
    backIcon:{
        fontFamily:fonts.OPENSANS_BOLD,
        fontSize: 30, 
        color:colors.MAIN,
    },
    rowsThumbnails: {
        flexDirection: 'row', 
        flexWrap: 'wrap'
    },
}