import Toast from 'react-native-root-toast';
import { colors, globals } from '../../config/constants';

export default {
	success: (
		message,
		duration = Toast.durations.LONG,
		opacity = globals.TOAST_DEFAULT_OPACITY,
		position = Toast.positions.CENTER
	) => {
		// Add a Toast on screen.
		Toast.show(message, {
			duration: duration,
			position: position,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
			opacity: opacity,
			backgroundColor: colors.MAIN,
			textColor: colors.ALERT_TEXT
		});
	},
	error: (
		message,
		duration = Toast.durations.LONG,
		opacity = globals.TOAST_DEFAULT_OPACITY,
		position = Toast.positions.CENTER
	) => {
		// Add a Toast on screen.
		Toast.show(message, {
			duration: duration,
			position: position,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
			opacity: opacity,
			backgroundColor: colors.DANGER,
			textColor: colors.ALERT_TEXT
		});
	},
	info: (
		message,
		duration = Toast.durations.LONG,
		opacity = globals.TOAST_DEFAULT_OPACITY,
		position = Toast.positions.CENTER
	) => {
		// Add a Toast on screen.
		Toast.show(message, {
			duration: duration,
			position: position,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
			opacity: opacity,
			backgroundColor: colors.INFO,
			textColor: colors.ALERT_TEXT
		});
	},
	custom: (
		message,
		duration = Toast.durations.LONG,
		opacity = globals.TOAST_DEFAULT_OPACITY,
		position = Toast.positions.CENTER,
		backgroundColor = colors.MAIN,
		textColor = colors.ALERT_TEXT
	) => {
		// Add a Toast on screen.
		Toast.show(message, {
			duration: duration,
			position: position,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
			opacity: opacity,
			backgroundColor: backgroundColor,
			textColor: textColor
		});
	}
};
