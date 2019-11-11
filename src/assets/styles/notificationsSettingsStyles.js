import { colors, fonts } from '../../config/constants';

export const NotificationsSettingsStyles = {
	oneItemContainer: {
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 16,
		paddingVertical: 25,
		borderBottomWidth: 1,
		borderBottomColor: colors.LINES,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	labelText: { fontFamily: fonts.OPENSANS_REGULAR, fontSize: 16, color: '#5F5F5F' },
	groupContainer: {
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: colors.LINES,
		paddingHorizontal: 16,
		paddingVertical: 20
	},
	groupHeaderText: {
		fontFamily: fonts.OPENSANS_SEMI_BOLD,
		fontSize: 16,
		color: '#5F5F5F',
		marginBottom: 25
	},
	groupItemContainer: {
		flexDirection: 'row',
		width: '100%',
		paddingVertical: 8,
		justifyContent: 'space-between',
		alignItems: 'center'
	}
};
