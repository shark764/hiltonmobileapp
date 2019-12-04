import { Dimensions } from 'react-native';
import { fonts, colors } from '../../config/constants';

const { height, width } = Dimensions.get('window');

export const postStyle = {
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)'
	},
	title: {
		fontFamily: fonts.OPENSANS_SEMI_BOLD,
		fontSize: 16,
		color: '#2F2F2F'
	},
	backIcon: {
		fontFamily: fonts.OPENSANS_BOLD,
		fontSize: 30,
		color: colors.MAIN
	},
	postFrame: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		padding: 10
	},
	leftSide: {
		padding: 10,
		paddingBottom: 0,
		paddingTop: 0,
		alignSelf: 'center'
	},
	rightSide: {
		width: width * 0.23,
		height: height * 0.25,
		paddingRight: 10
	},
	commentBox: {
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.01)',
		paddingLeft: 20,
		width: width * 0.6
	},
	textStyle: {
		alignSelf: 'center',
		color: '#5F5F5F',
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 16
	},
	boostRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.05)',
		paddingTop: 10
	},
	boostText: {
		color: colors.MAIN,
		paddingLeft: 5,
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 16
	},
	subtitleRow: {
		paddingHorizontal: 20,
		paddingBottom: 10,
		paddingTop: 10,
		paddingBottom: 20
	},
	subtitleText: {
		color: '#5F5F5F',
		fontFamily: fonts.OPENSANS_SEMI_BOLD,
		fontSize: 16
	},
	normalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingBottom: 15
	},
	endRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingBottom: 25,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.05)'
	},
	itemText: {
		color: '#5F5F5F',
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 16
	},
	postButtonContainer: { flex: 1, justifyContent: 'flex-end' },
	postButton: {
		flex: 0,
		backgroundColor: colors.MAIN,
		borderRadius: 6,
		padding: 10,
		paddingHorizontal: 14,
		alignSelf: 'center',
		margin: 10,
		width: width * 0.8,
		height: height * 0.08,
		marginBottom: 20
	},
	postTextButton: {
		fontFamily: fonts.OPENSANS_BOLD,
		color: 'white',
		fontSize: 19
	}
};
