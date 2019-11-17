import { colors, fonts } from '../../config/constants';

export const globalStyles = {
	line: { borderTopColor: colors.LINES, borderTopWidth: 1, marginVertical: 20, width: '100%' },
	errorText: { fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: colors.DANGER },
	loading: {
		width: 50,
		height: 50,
		alignSelf: 'center'
	}
};
