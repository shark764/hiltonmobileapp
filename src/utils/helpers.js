import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import numberAbbreviation from 'number-abbreviate';
import { globals } from '../config/constants';
import AlertMessages from '../components/commons/AlertMessages';
import { Platform } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import NavigationService from '../services/NavigationService';
import { PermissionsAndroid } from 'react-native';

//************************************************************************************************
//This is used to return an object with the display property based on a truthy
//************************************************************************************************
export const getShowHideStyle = condition => (condition ? { display: 'flex' } : { display: 'none' });

//************************************************************************************************
//To check if an email string is valid
//************************************************************************************************
export const validateEmail = email => {
	const reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/;
	const isValid = reg.test(String(email).toLowerCase());

	return isValid;
};

//************************************************************************************************
//Native Share video, based on url provided.
//************************************************************************************************
export const shareVideo = async videoUrl => {
	try {
		const message = '';

		const blob = await RNFetchBlob.config({
			fileCache: true,
			appendExt: 'mp4'
		}).fetch('GET', videoUrl, {});

		const base64String = await blob.base64();
		let url = 'file://' + blob.path();

		if (Platform.OS === 'android') url = `data:video/mp4;base64,${base64String}`;

		const result = await Share.open({
			title: globals.SHARE_TITLE,
			message,
			url
		});

		console.log(result);
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				// shared with activity type of result.activityType
			} else {
				// shared
			}
		} else if (result.action === Share.dismissedAction) {
			// dismissed
			console.log('Share dismissed');
		}

		const exists = await RNFS.exists(blob.path());
		if (exists) await RNFS.unlink(blob.path());
	} catch (error) {
		if (error.message && error.message.indexOf('User did') === -1) AlertMessages.error(error.message);
	}
};

//************************************************************************************************
//To build the url of the video and add it to the object
//************************************************************************************************
export const getVideosWithUrlField = videos => {
	if (!videos) return;
	return videos.map(video => {
		video.url = video.media.video;
		video.thumbnail = video.media.thumb;
		return video;
	});
};

export const setUserAvatarUrl = user => {
	if (!user) return user;

	user.avatar = globals.MEDIA_SERVER_URL + `/avatars/${user.id}/${user.avatar}`;
	return user;
};

export const goToRootRouteFromChild = (parentRoute, rootRoute) => {
	try {
		//Redirect to Home Process
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: parentRoute })]
		});

		//Go to current parent route
		NavigationService.dispatch(resetAction);

		//Now, go to sibling screen - Home
		NavigationService.dispatch({ type: 'Navigation/NAVIGATE', routeName: rootRoute });
	} catch (error) {
		console.error(error.message);
	}
};

export const goToRootRouteFromSibling = rootRoute => {
	try {
		//Now, go to sibling screen - Home
		NavigationService.dispatch({ type: 'Navigation/NAVIGATE', routeName: rootRoute });
	} catch (error) {
		console.error(error.message);
	}
};

export const numberAbbreviate = (number, precision) => {
	const formatted = numberAbbreviation(number, precision)
		.toString()
		.toUpperCase();
	return formatted;
};

export const requestCameraPermission = async () => {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
			title: 'Cool Photo App Camera Permission',
			message: 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.',
			buttonNeutral: 'Ask Me Later',
			buttonNegative: 'Cancel',
			buttonPositive: 'OK'
		});
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return false;
		console.warn(err);
	}
};
