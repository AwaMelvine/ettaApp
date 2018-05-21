import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Button,
	TouchableOpacity,
	AsyncStorage,
	Alert,
	Keyboard,
	ActivityIndicator,
	BackHandler
} from "react-native";
import moment from "moment-es6";
import jwt_decode from "jwt-decode";
import PushNotification from "react-native-push-notification";
import haversine from "haversine";
import BackgroundGeolocation from "react-native-mauron85-background-geolocation";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { Actions } from "react-native-router-flux";

export default class CheckIn extends Component<{}> {
	static navigationOptions = {
		title: "Check In",
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			currentTime: null,
			address: null,
			error: null,
			name: this.props.firstName,
			email: this.props.email,
			userId: null,
			entryId: "",
			isCheckedIn: null,
			shouldCheckIn: null,
			checkInTime: null,
			elapsedTime: null,
			hours: null
		};
		this.getLocation = this.getLocation.bind(this);
		this.checkInEmployee = this.checkInEmployee.bind(this);
		this.checkOutEmployee = this.checkOutEmployee.bind(this);
		this.getUserId = this.getUserId.bind(this);
		this.logout = this.logout.bind(this);
		//this.getAddress = this.getAddress.bind(this);
	}

	componentDidMount() {
		PushNotification.configure({
			onNotification: function(notification) {
				console.log("NOTIFICATION:", notification);
			}
		});
		Keyboard.dismiss();

		BackHandler.addEventListener("hardwareBackPress", () => {
			BackHandler.exitApp();
		});

		BackgroundGeolocation.configure({
			desiredAccuracy: 10,
			stationaryRadius: 50,
			distanceFilter: 50,
			debug: false,
			startOnBoot: false,
			stopOnTerminate: true,
			locationProvider:
				Platform.OS === "ios"
					? BackgroundGeolocation.DISTANCE_FILTER_PROVIDER
					: BackgroundGeolocation.ACTIVITY_PROVIDER,
			interval: 10000,
			fastestInterval: 5000,
			activitiesInterval: 10000,
			stopOnStillActivity: true,
			saveBatteryOnBackground: true
		});

		BackgroundGeolocation.on("authorization", status => {
			console.log(
				"[INFO] BackgroundGeolocation authorization status: " + status
			);
			if (status !== BackgroundGeolocation.AUTHORIZED) {
				Alert.alert(
					"Location services are disabled",
					"Would you like to open location settings?",
					[
						{
							text: "Yes",
							onPress: () =>
								BackgroundGeolocation.showLocationSettings()
						},
						{
							text: "No",
							onPress: () => console.log("No Pressed"),
							style: "cancel"
						}
					]
				);
			}
		});

		// you can also just start without checking for status
		BackgroundGeolocation.start();

		BackgroundGeolocation.on("location", location => {
			console.log(location);
			const positionCoords = {
				latitude: location.latitude,
				longitude: location.longitude
			};
			// check if current location is within range of the office
			const isWithinRange = this.checkIfWithinRange(positionCoords);

			// if within range, send a check in reminder if necessary
			if (isWithinRange) {
				if (
					this.state.shouldCheckIn !== true &&
					this.state.isCheckedIn !== true
				) {
					this.sendCheckInReminder();
					this.setState({ shouldCheckIn: true });
				}
			} else {
				this.setState({ shouldCheckIn: false });
			}
			this.getLocation(positionCoords).then(address => {
				console.log(address);
				this.setState({ address });
			});
		});

		// Set timer for clock
		this.time = setInterval(() => {
			this.setState({ currentTime: moment().format("h:mm:ss a") });
		}, 1000);

		// Get user's name and store in params
		AsyncStorage.getItem("name", (err, name) => {
			this.setState({ name });
		});
		AsyncStorage.getItem("isCheckedIn", (err, isCheckedIn) => {
			var val = isCheckedIn === "true";
			this.setState({ isCheckedIn: val });
		});
		AsyncStorage.getItem("checkInTime", (err, checkInTime) => {
			this.setState({
				checkInTime
			});
		});

		var hours = new Date().getHours();
		this.setState({ hours });
	}

	componentWillUnmount() {
		clearInterval(this.time);
		navigator.geolocation.clearWatch(this.watchID);
		BackgroundGeolocation.events.forEach(event =>
			BackgroundGeolocation.removeAllListeners(event)
		);
	}

	// getAddress() {
	// 	this.setState({ address: null });
	// 	navigator.geolocation.getCurrentPosition(
	// 		position => {
	// 			const positionCoords = {
	// 				latitude: position.coords.latitude,
	// 				longitude: position.coords.longitude
	// 			};
	// 			this.getLocation(positionCoords).then(address => {
	// 				console.log(address);
	// 				this.setState({ address });
	// 			});
	// 		},
	// 		error => this.setState({ error: error.message }),
	// 		{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
	// 	);
	// }

	checkIfWithinRange(positionCoords) {
		const { latitude, longitude } = positionCoords;
		const fintechCoords = {
			latitude: 6.4289653,
			longitude: 3.4221574
		};
		const pointDistance = haversine(fintechCoords, positionCoords, {
			unit: "meter"
		});
		console.log(pointDistance);
		// Check if current user location is within 100m of the office
		if (pointDistance < 100) {
			return true;
		} else {
			return false;
		}
	}


	async getLocation(positionCoords) {
		const { latitude, longitude } = positionCoords;
		const searchURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyCU_XbSzFXulw_pi1HQ9qbKKH9LyUSyoeM`;
		const response = await fetch(searchURL);
		const json = await response.json();
		return json.results[0].formatted_address;
	}

	checkInEmployee() {
		const checkInData = {
			// name: this.props.firstName,
			email: this.state.name,
			location: "this.state.address",
			time: moment().format()
		};
		this.setState({ error: null });
		const json = JSON.stringify(checkInData);
		console.log(checkInData);
		AsyncStorage.getItem("jwt", (err, token) => {
			fetch("https://checkin-node-app.herokuapp.com/checkin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `JWT ${token}`
				},
				body: json
			})
				.then(response => response.json())
				.then(json => {
					if (!json.error) {
						Alert.alert(
							"Checked in at " +
								this.state.address +
								" at " +
								moment(json.timeIn).format("hh:mm:ss A")
						);
						this.sendCheckOutReminder(json.timeIn);
						this.setState({ checkInTime: json.timeIn });
					}
					this.setState({
						error: json.error,
						isCheckedIn: true
					});
					AsyncStorage.setItem("isCheckedIn", "true");
					AsyncStorage.setItem("checkInTime", json.timeIn);
					// let elapsedTime = moment(json.timeIn).fromNow();
					// console.log("elapsed: ", elapsedTime);
					// this.setState({
					// 	elapsedTime
					// });
				})
				.catch(error => console.log(error));
		});
	}

	checkOutEmployee() {
		const checkOutTime = moment().format();
		this.setState({ error: null });

		AsyncStorage.getItem("jwt", (err, token) => {
			var decodedToken = jwt_decode(token);
			var userId = decodedToken.id;

			const json = JSON.stringify({
				userId: userId,
				time: checkOutTime
			});
			fetch("https://checkin-node-app.herokuapp.com/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `JWT ${token}`
				},
				body: json
			})
				.then(response => response.json())
				.then(json => {
					if (json.error) {
						this.setState({ error: json.error });
					}
					Alert.alert(
						"Checked out of " +
							this.state.address +
							" at " +
							moment(json.timeOut).format("hh:mm:ss A")
					);
					this.setState({ isCheckedIn: false, checkInTime: null });
					AsyncStorage.setItem("isCheckedIn", "false");
					AsyncStorage.removeItem("checkInTime", err => {
						console.log(err);
					});
				});
		});
	}

	logout() {
		PushNotification.cancelAllLocalNotifications();
		BackgroundGeolocation.stop();
		AsyncStorage.multiRemove(["jwt", "name"], (err, success) => {
			if (err) {
				console.log(err);
			} else {
				Actions.reset("login");
			}
		});
	}

	getUserId() {
		AsyncStorage.getItem("jwt")
			.then(token => jwt_decode(token))
			.then(decodedToken => this.setState({ userId }));
	}

	sendCheckInReminder() {
		PushNotification.localNotificationSchedule({
			message: "Don't forget to check in!",
			date: new Date(Date.now())
		});
	}

	sendCheckOutReminder(checkInTime) {
		let time = moment(checkInTime)
			.add(8, "h")
			.format();
		var sendDate = new Date(time);
		PushNotification.localNotificationSchedule({
			message: "You've been at work for 8 hours! Go home!!!",
			date: sendDate
		});
	}

	render() {
		return (
			<LinearGradient
				colors={["#3498DB", "#ffffff"]}
				start={{ x: 0.0, y: 0.39 }}
				locations={[0.5, 0.5]}
				style={{ flex: 1 }}
			>
				<View style={styles.checkInView}>
					<View style={styles.greeting}>
						<Text
							style={{
								fontSize: 48,
								color: "#ffffff",
								textAlign: "center"
							}}
						>
							Good{" "}
							{this.state.hours >= 12 ? "Afternoon " : "Morning "}
							Tolu!
						</Text>
					</View>
					<View style={styles.dateBox}>
						<Text style={styles.date}>
							{moment().format("dddd, MMMM Do YYYY")}
						</Text>
						<Text style={styles.time}>
							{this.state.currentTime}
						</Text>
						{this.state.address ? (
							<Text
								style={{
									textAlign: "center",
									margin: 5,
									color: "white"
									//opacity: 0.8
								}}
							>
								{this.state.address}
							</Text>
						) : (
							<View style={{ flexDirection: "row" }}>
								<Icon
									name="location-pin"
									size={20}
									color="white"
								/>
								<Text
									style={{
										color: "white",
										fontSize: 18,
										textAlign: "center"
									}}
								>
									56a Adeola Odeku, Victoria Island Lagos
								</Text>
							</View>
						)}
					</View>
					<View>
						{this.state.error ? (
							<Text>{this.state.error}</Text>
						) : (
							undefined
						)}
					</View>
					<View style={styles.buttons}>
						<TouchableOpacity
							style={
								this.state.isCheckedIn
									? styles.checkInButton
									: styles.checkInButton
							}
							onPress={this.checkInEmployee}
							disabled={this.state.isCheckedIn}
						>
							<Text
								style={{
									textAlign: "center",
									color: "#3498db",
									fontWeight: "bold"
								}}
							>
								CHECK IN
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={
								this.state.isCheckedIn
									? styles.checkOutButton
									: styles.checkOutButton
							}
							onPress={this.checkOutEmployee}
							disabled={!this.state.isCheckedIn}
						>
							<Text
								style={{
									textAlign: "center",
									color: "white",
									fontWeight: "bold"
								}}
							>
								CHECK OUT
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ marginTop: 20 }}>
						<Text
							style={{
								fontFamily: "Helvetica",
								opacity: 0.8
							}}
						>
							{this.state.checkInTime
								? "Checked in " +
								  moment(this.state.checkInTime).fromNow()
								: undefined}
						</Text>
					</View>
					<View style={styles.logout}>
						<TouchableOpacity
							//style={styles.logoutButton}
							onPress={this.logout}
						>
							<Icon name="logout" size={60} color="#3498DB" />
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	checkInView: {
		flex: 1,

		alignItems: "center"
	},
	greeting: {
		marginTop: 50,
		alignItems: "center",
		justifyContent: "center",
		height: 125
	},
	dateBox: {
		marginTop: 50,
		alignItems: "center"
	},
	date: {
		fontFamily: "Helvetica",
		fontSize: 36,
		textAlign: "center",
		color: "white"
	},
	time: {
		fontFamily: "Helvetica-Light",
		fontSize: 48,
		color: "white",
		height: 75
	},
	buttons: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 60
	},
	checkInButton: {
		elevation: 4,
		width: 150,
		height: 50,
		borderRadius: 50,
		borderColor: "#ffffff",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff"
	},
	checkOutButton: {
		elevation: 4,
		width: 150,
		height: 50,
		borderRadius: 50,
		borderColor: "#ffffff",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#3498DB"
	},
	disabledButton: {
		backgroundColor: "#c9c9c9",
		width: 300,
		height: 50,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		margin: 10
	},
	logout: {
		flexDirection: "row",
		width: "100%",
		alignItems: "flex-start",
		//width: "100%",
		marginTop: 50,
		marginLeft: 50
	}
});
