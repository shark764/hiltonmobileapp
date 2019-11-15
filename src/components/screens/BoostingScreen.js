import React, { Component } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { connect } from 'react-redux';
import Slider from '@react-native-community/slider';
import { Button } from 'react-native-elements';
import { colors, fonts, globals } from '../../config/constants';
import IconFeather from 'react-native-vector-icons/Feather';
import AlertMessages from '../commons/AlertMessages';

class BoostingScreen extends Component {
	state = {
		laughs: 1,
		views: globals.VIEWS_SLIDER_START,
		grapeVine: true,
		currentEarnings: 0,
		predictionEarnings: 0
	};
	showInfo = () => {
		AlertMessages.info('Here you can do a lot of thing regaring your money');
	};

	onLaughSlide = value => {
		this.setState({ laughs: parseInt(value) });
	};

	onViewsSlide = value => {
		this.setState({ views: parseInt(value) });
	};

	onGrapeVineTouch = value => {
		this.setState({ grapeVine: value });
	};

	onJoinPremiun = () => {};

	render() {
		const { predictionEarnings, laughs, views, grapeVine } = this.state;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.MAIN }}>
				<View
					style={{
						flex: 3,
						alignItems: 'center',
						justifyContent: 'space-evenly',
						borderBottomWidth: 2,
						borderBottomColor: '#d3d3d3'
					}}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text
							style={{
								color: '#FFFFFF',
								marginRight: 10,
								fontFamily: fonts.OPENSANS_REGULAR,
								fontSize: 16
							}}
						>
							Boost balance
						</Text>
						<TouchableOpacity onPress={this.showInfo}>
							<IconFeather name={'info'} size={20} color={'#9F9F9F'} />
						</TouchableOpacity>
					</View>
					<Text
						style={{
							color: '#FFFFFF',
							marginRight: 10,
							fontFamily: fonts.OPENSANS_SEMI_BOLD,
							fontSize: 40
						}}
					>
						$1200.37
					</Text>
					<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
						<View style={{ alignItems: 'center', marginBottom: 20 }}>
							<View
								style={{
									width: 60,
									height: 60,
									borderRadius: 16,
									backgroundColor: '#A096EF',
									marginBottom: 15,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<IconFeather name={'plus-circle'} size={30} color={'#fff'} />
							</View>

							<Text style={{ color: '#FFFFFF', fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 14 }}>
								Add account
							</Text>
						</View>
						<View style={{ alignItems: 'center', marginBottom: 20 }}>
							<View
								style={{
									width: 60,
									height: 60,
									borderRadius: 16,
									backgroundColor: '#FFFFFF',
									marginBottom: 15,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<IconFeather name={'arrow-right'} size={30} color={colors.MAIN} />
							</View>
							<Text style={{ color: '#FFFFFF', fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 14 }}>
								Transfer
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						flex: 5,
						backgroundColor: '#fff',
						padding: 16,
						paddingBottom: 0,
						justifyContent: 'space-evenly'
					}}
				>
					<View style={{ alignItems: 'center' }}>
						<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 16, color: '#2F2F2F' }}>
							Predict Your Earnings
						</Text>
						<Text
							style={{
								fontFamily: fonts.OPENSANS_SEMI_BOLD,
								fontSize: 40,
								color: colors.MAIN,
								marginTop: 15
							}}
						>
							${predictionEarnings.toLocaleString()}
						</Text>
					</View>
					<View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 14, color: '#2F2F2F' }}>
								Laughs
							</Text>
							<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 16, color: colors.MAIN }}>
								{laughs}
							</Text>
						</View>
						<Slider
							value={laughs}
							onValueChange={this.onLaughSlide}
							minimumValue={1}
							maximumValue={10}
							minimumTrackTintColor={colors.MAIN}
							maximumTrackTintColor="#DED9FF"
							thumbTintColor={colors.MAIN}
						/>
					</View>
					<View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 14, color: '#2F2F2F' }}>
								Views
							</Text>
							<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 16, color: colors.MAIN }}>
								{views.toLocaleString()}
							</Text>
						</View>
						<Slider
							value={views}
							onValueChange={this.onViewsSlide}
							minimumValue={globals.VIEWS_SLIDER_START}
							maximumValue={globals.VIEW_SLIDER_END}
							minimumTrackTintColor={colors.MAIN}
							maximumTrackTintColor="#DED9FF"
							thumbTintColor={colors.MAIN}
						/>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 16, color: '#2F2F2F' }}>
							GrapeVine
						</Text>
						<Switch
							value={grapeVine}
							onValueChange={this.onGrapeVineTouch}
							trackColor={{ true: colors.MAIN }}
						/>
					</View>
					<Button
						containerStyle={{ width: '100%' }}
						buttonStyle={{
							backgroundColor: colors.MAIN,
							padding: 16,
							borderRadius: 6
						}}
						titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
						title="Join GrapeVine"
						onPress={this.onJoinPremiun}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, null)(BoostingScreen);
