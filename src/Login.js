import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Button,
	TextInput,
	AsyncStorage,
	KeyboardAvoidingView,
	TouchableOpacity,
	Keyboard,
	Alert,
	ActivityIndicator
} from "react-native";
import moment from "moment-es6";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";

export default class Login extends Component<{}> {
	static navigationOptions = {
		title: "Welcome",
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			error: "",
			hasLoaded: true
		};
		this.onLogin = this.onLogin.bind(this);
	}

	onLogin() {
		this.setState({ hasLoaded: false });
		Keyboard.dismiss();
		const { navigate } = this.props.navigation;
		const data = {
			username: this.state.email.trim(),
			password: this.state.password.trim()
		};

		if (data.username.length === 0) {
			return this.setState({
				error: "Username cannot be null"
			});
		}
		if (data.password.length < 6) {
			return this.setState({
				error: "Password must be longer than 5 characters"
			});
		}
		this.setState({ error: "" });

		console.log(data);

		const json = JSON.stringify(data);
		fetch("https://checkin-node-app.herokuapp.com/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: json
		})
			.then(response => response.json())
			.then(res => {
				if (res.error) {
					return this.setState({ error: res.error });
				} else {
					AsyncStorage.multiSet([
						["jwt", res.token],
						["name", this.state.email]
					]);
					navigate("checkin", { username: this.state.email });
				}
				this.setState({ hasLoaded: true });
			})
			.catch(error => console.log(error));
	}

	componentDidMount() {}

	render() {
		return (
			<KeyboardAvoidingView
				keyboardVerticalOffset={-500}
				behavior="padding"
				style={styles.loginForm}
			>
				<View style={styles.headerText}>
					<Text style={styles.titleSubtitle}>GET STARTED</Text>
					<Text style={styles.titleText}>Login</Text>
				</View>
				<View style={styles.inputArea}>
					<TextInput
						style={styles.inputBox}
						onChangeText={email => this.setState({ email })}
						value={this.state.email}
						placeholder="Email"
						placeholderTextColor="#6a6a6a"
						underlineColorAndroid={"rgba(0,0,0,0)"}
						autocapitalize="none"
					/>
					<TextInput
						style={styles.inputBox}
						onChangeText={password => {
							this.setState({ password });
						}}
						value={this.state.password}
						placeholder="Password"
						placeholderTextColor="#6a6a6a"
						underlineColorAndroid={"rgba(0,0,0,0)"}
						secureTextEntry={true}
					/>
				</View>
				<View>
					{this.state.error ? (
						<Text
							style={{
								justifyContent: "center",
								alignItems: "center",
								textAlign: "center",
								marginBottom: 10
							}}
						>
							{this.state.error}
						</Text>
					) : (
						undefined
					)}
				</View>
				<View style={{ marginBottom: 10 }}>
					{!this.state.hasLoaded && !this.state.error ? (
						<ActivityIndicator size="large" color="black" />
					) : (
						undefined
					)}
				</View>
				<View style={styles.buttons}>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={this.onLogin}
					>
						<Text style={styles.loginButtonText}>Login</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.backButton}
						onPress={() => Actions.pop()}
					>
						<Text style={styles.backButtonText}>Back</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	headerText: {
		//flexGrow: 1,
		width: 300,
		alignItems: "flex-start",
		marginTop: 50
	},
	titleSubtitle: {
		color: "#99A3A4",
		fontSize: 18,
		fontWeight: "bold"
	},
	titleText: {
		fontSize: 44,
		fontWeight: "bold",
		color: "#000000"
	},
	loginForm: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white"
	},
	inputArea: {
		marginTop: 25,
		marginBottom: 25
	},
	inputBox: {
		height: 60,
		width: 300,
		borderColor: "#F0F0F0",
		borderRadius: 5,
		borderWidth: 1,
		margin: 10,
		padding: 10,
		fontSize: 16
	},
	buttons: {
		marginBottom: 20
	},
	loginButton: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#3498DB",
		width: 300,
		height: 50,
		borderRadius: 5
	},
	backButton: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		width: 300,
		height: 50,
		borderRadius: 5
	},
	loginButtonText: {
		fontFamily: "Helvetica",
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "bold"
	},
	backButtonText: {
		fontFamily: "Helvetica",
		color: "grey",
		fontSize: 18,
		fontWeight: "bold"
	}
});
