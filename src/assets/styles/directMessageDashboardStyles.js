import { fonts } from '../../config/constants';

export const directMessageDashboardStyles = {
	mainContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
		marginHorizontal: 16,
		marginTop: 0
	},
	listContentContainer: { paddingTop: 20 },
	commentItemContainer: {
		flexDirection: 'row',
		marginBottom: 20,
		width: '100%'
	},
	commentUserImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		alignItems: 'center',
		borderColor: '#2F2F2F'
	},
	commentCenterContainer: {
		paddingLeft: 10,
		flex: 1,
		flexShrink: 1
	},
	commentUserHandleText: { color: '#2F2F2F', fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 12 },
	commentUserFullNameText: { color: '#2F2F2F', fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12, marginLeft: 10 },
	commentText: { color: '#2F2F2F', fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12 },
	likeContainer: {
		height: 45,
		width: 45,
		alignItems: 'center',
		justifyContent: 'center'
	}
};
