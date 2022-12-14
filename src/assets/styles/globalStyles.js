import { colors, fonts } from '../../config/constants';

export const globalStyles = {
	line: { borderTopColor: colors.LINES, borderTopWidth: 1, marginVertical: 20, width: '100%' },
	errorText: { fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: colors.DANGER },
	loading: {
		width: 100,
		height: 100,
		alignSelf: 'center'
	},
	textBlackShadow: { textShadowColor: '#000', textShadowOffset: { width: 0.3, height: 0.3 }, textShadowRadius: 1 },
	textWhiteShadow: { textShadowColor: '#fff', textShadowOffset: { width: 0.3, height: 0.3 }, textShadowRadius: 1 }
};
