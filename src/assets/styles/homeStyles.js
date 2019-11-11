import { Dimensions } from 'react-native';
import { fonts } from '../../config/constants';

export const homeStyles = {
	mainContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#222'
	},
	videoPlayer: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	laughContainer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	laughAnimation: { height: 100, width: 100 },
	bottomContainer: {
		width: '100%',
		justifyContent: 'flex-end',
		zIndex: 100000,
		position: 'absolute',
		bottom: 0
	},
	gradientContainer: {
		flex: 1,
		flexDirection: 'row',
		padding: 20,
		paddingRight: 10,
		justifyContent: 'flex-end'
	},
	userContainer: { flex: 5, justifyContent: 'flex-end' },
	userImageContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		borderWidth: 1,
		borderColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10
	},
	userImageContainer2: {
		width: 55,
		height: 55,
		borderRadius: 27,
		borderWidth: 1,
		borderColor: '#fff',
		overflow: 'hidden'
	},
	userImage: { width: '100%', height: '100%' },
	userHandleContainer: { flexDirection: 'row' },
	userHandleText: {
		color: '#fff',
		fontFamily: fonts.OPENSANS_BOLD,
		fontSize: 16,
		textShadowColor: '#000',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2
	},
	dotSeparator: {
		color: '#fff',
		fontFamily: fonts.OPENSANS_BOLD,
		marginLeft: 10
	},
	userFollowText: {
		color: '#fff',
		fontFamily: fonts.OPENSANS_SEMI_BOLD,
		marginLeft: 10,
		fontSize: 16,
		textShadowColor: '#000',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2
	},
	videoCaptionText: {
		color: '#fff',
		marginTop: 5,
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 16,
		textShadowColor: '#000',
		textShadowOffset: { width: 0.3, height: 0.3 },
		textShadowRadius: 1
	},
	actionContainer: { alignItems: 'center', justifyContent: 'flex-end', right: 0, width: 50 },
	actionCounters: {
		color: '#fff',
		marginTop: 5,
		marginBottom: 15,
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 14,
		textShadowColor: '#000',
		textShadowOffset: { width: 0.3, height: 0.3 },
		textShadowRadius: 1
	}
};
