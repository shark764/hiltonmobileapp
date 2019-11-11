import { Dimensions } from 'react-native';
import { fonts,colors } from '../../config/constants';

const { height, width } = Dimensions.get('window');

export const profileStyle = {
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
      paddingTop: 30, 
      paddingBottom: 10, 
      paddingLeft: 10, 
      backgroundColor: 'white'
    },
      price: {
          fontSize: 10 , color: colors.SOFT_BLACK,
          fontFamily:fonts.OPENSANS_REGULAR
      },
      statsFollowers: {
          fontSize: 18 ,
          fontFamily:fonts.OPENSANS_SEMI_BOLD
      },
      profileContainer: {
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'flex-start'
      },
      followersContainer: {
          paddingTop: 20,
          paddingBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end'
      },
      profilePhoto: {
          width: 75, 
          height: 75, 
          borderRadius: 37.5
      },
      userName: {
          fontSize: 16, 
          fontFamily: fonts.OPENSANS_SEMI_BOLD
      },
      bioInfo: {
          fontSize: 12, 
          fontFamily: fonts.OPENSANS_REGULAR,
          color: colors.GRAY
      },
      statsDescription: {
          fontSize: 12, 
          color: colors.GRAY,
          fontFamily:fonts.OPENSANS_REGULAR
      },
      thumbnails: {
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          borderTopWidth: 1, 
          borderTopColor: colors.LIGHT_GRAY,
          backgroundColor: colors.LIGHT_GRAY
      },
      rowsThumbnails: {
          flexDirection: 'row', 
          flexWrap: 'wrap'
      },
      image: {
          flex: 1,
          alignSelf: 'stretch'
      }
  };