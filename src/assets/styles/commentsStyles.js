import { Dimensions } from 'react-native';
import { fonts } from '../../config/constants';

const screenWidth = Math.round(Dimensions.get('window').width) - 20;

export const commentsStyles = {
	mainContainer: {
		backgroundColor: '#242424'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		borderBottomWidth: 1,
		borderBottomColor: '#464646'
	},
	backButton: { position: 'absolute', left: 20 },
	headerText: {
		fontFamily: fonts.OPENSANS_SEMI_BOLD,
		fontSize: 16,
		color: '#C6C6C6'
	},
	commentsList: {
		padding: 16
	},
	commentItemContainer: {
		flexDirection: 'row',
		marginBottom: 20,
		width: screenWidth
	},
	commentUserImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		alignItems: 'center',
		borderColor: '#e3e3e3'
	},
	commentCenterContainer: {
		paddingLeft: 10,
		width: screenWidth - 90
	},
	commentUserHandleText: { color: '#fff', fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 12 },
	commentText: { color: '#fff', fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12 },
	likeContainer: {
		height: 45,
		width: 45,
		alignItems: 'center',
		justifyContent: 'center'
	},
	likeAnimation: { height: 45, width: 45 },
	likeCounter: {
		color: '#bFbFbF',
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 9,
		marginTop: -10
	},
	addCommentContainer: {
		flexDirection: 'row',
		height: 60,
		alignItems: 'center',
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderColor: '#464646',
		backgroundColor: '#242424'
	},
	currentUserImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e3e3e3'
	},
	addCommentInput: {
		flex: 1,
		marginHorizontal: 16,
		height: 41,
		borderColor: '#e3e3e3',
		borderWidth: 1,
		borderRadius: 7,
		marginVertical: 10,
		//backgroundColor: '#fff',
		paddingVertical: 5,
		paddingHorizontal: 15,
		color: '#fff',
		fontFamily: fonts.OPENSANS_REGULAR
	}
};
