import { colors, fonts } from '../../config/constants';

export const settingsStyles = {
	mainContainer: { flex: 1, paddingTop: 20 },
	itemContainer: { flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', paddingBottom: 20 },
	label: { marginLeft: 10, color: '#5F5F5F', fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 16 },
	logoutLabel: { color: '#6C5CE7' },
	line: { borderTopColor: colors.LINES, borderTopWidth: 1, marginBottom: 20 }
};
