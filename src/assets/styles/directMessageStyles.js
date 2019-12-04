import { Dimensions } from 'react-native';
import { fonts } from '../../config/constants';

const screenWidth = Dimensions.get('window').width;

export const directMessageStyles = {
	safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
	mainContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	listContentContainer: {
		marginHorizontal: 16,
		justifyContent: 'flex-end',
		paddingVertical: 20,
		flexGrow: 1
	},
	messageItemContainer: {
		flexDirection: 'row',
		marginBottom: 20,
		width: '100%'
	},
	mymessageItemContainer: {
		justifyContent: 'flex-end'
	},
	messageUserImage: {
		width: '100%',
		height: '100',
		borderRadius: 20
	},
	messageUserImageContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e3e3e3',
		alignItems: 'center',
		overflow: 'hidden'
	},
	messageContainer: {
		paddingLeft: 10,
		borderWidth: 1,
		borderColor: '#d9d9d9',
		borderRadius: 12,
		padding: 14,
		marginLeft: 10,
		maxWidth: screenWidth - 140
	},
	myMessageContainer: { backgroundColor: '#E2E2E2' },
	messageText: { color: '#5F5F5F', fontFamily: fonts.OPENSANS_REGULAR, fontSize: 14 },
	addMessageContainer: {
		flexDirection: 'row',
		height: 55,
		alignItems: 'center',
		paddingHorizontal: 10,
		borderTopWidth: 1,
		borderColor: '#d9d9d9',
		backgroundColor: '#F7F7F7',
		width: '100%'
	},
	addMessageInput: {
		marginHorizontal: 10,
		height: 35,
		borderColor: '#e3e3e3',
		borderWidth: 1,
		borderRadius: 18,
		marginVertical: 10,
		backgroundColor: '#fff',
		paddingVertical: 5,
		paddingLeft: 15,
		paddingRight: 30,
		color: '#222',
		fontFamily: fonts.OPENSANS_REGULAR
	},
	iconStick: {
		position: 'absolute',
		right: 20
	},
	iconCamera: { marginRight: 10 }
};
