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
		this.onRegister = this.onRegister.bind(this);
	}

	onRegister() {
		this.setState({ hasLoaded: false });
		Keyboard.dismiss();
		const data = {
			username: this.state.username.trim(),
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
		const json = JSON.stringify(data);
		fetch("https://peaceful-castle-10340.herokuapp.com/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: json
		})
			.then(response => response.json())
			.then(json => {
				if (json.error) {
					this.setState({ error: json.error.message });
				} else {
					Alert.alert("Registration Successful");
				}
				this.setState({ hasLoaded: true });
			})
			.catch(error => console.log(error));
	}

	onLogin() {
		this.setState({ hasLoaded: false });
		Keyboard.dismiss();
		const { navigate } = this.props.navigation;
		const data = {
			username: this.state.username.trim(),
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

		const json = JSON.stringify(data);
		fetch("https://peaceful-castle-10340.herokuapp.com/login", {
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
						["name", this.state.username]
					]);
					navigate("CheckIn", { username: this.state.username });
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
				<View>
					<Text style={styles.appName}>E.T.T.A</Text>
					{this.state.error ? (
						<Text
							style={{
								justifyContent: "center",
								alignItems: "center",
								textAlign: "center"
							}}
						>
							{this.state.error}
						</Text>
					) : (
						undefined
					)}
				</View>
				<View>
					<TextInput
						style={styles.inputBox}
						onChangeText={username => this.setState({ username })}
						value={this.state.username}
						placeholder="Username"
						autocapitalize="none"
					/>
					<TextInput
						style={styles.inputBox}
						onChangeText={password => {
							this.setState({ password });
						}}
						value={this.state.password}
						placeholder="Password"
						secureTextEntry={true}
					/>
				</View>
				<View>
					{!this.state.hasLoaded && !this.state.error ? (
						<ActivityIndicator size="large" color="black" />
					) : (
						undefined
					)}
				</View>
				<View>
					<LinearGradient
						colors={["#00c6ff", "#00c6ff"]}
						style={styles.linearGradient}
					>
						<TouchableOpacity
							style={styles.signUpButtons}
							onPress={this.onLogin}
						>
							<Text style={{ color: "#00c6ff" }}>Login</Text>
						</TouchableOpacity>
					</LinearGradient>
					<LinearGradient
						colors={["#00c6ff", "#00c6ff"]}
						style={styles.linearGradient}
					>
						<TouchableOpacity
							style={styles.signUpButtons}
							onPress={this.onRegister}
						>
							<Text style={{ color: "#00c6ff" }}>Register</Text>
						</TouchableOpacity>
					</LinearGradient>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	appName: {
		fontSize: 48,
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		color: "black"
	},
	linearGradient: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		width: 250,
		height: 50,
		margin: 10
	},
	loginForm: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white"
	},
	inputBox: {
		height: 40,
		width: 250,
		...Platform.select({
			ios: {
				height: 40,
				width: 250,
				borderColor: "#9B9B9B",
				borderTopWidth: 0,
				borderLeftWidth: 0,
				borderRightWidth: 0,
				backgroundColor: "white",
				borderWidth: 1,
				margin: 10
			}
		})
	},
	signUpButtons: {
		backgroundColor: "white",
		//borderColor: "#C4C4C4",
		//borderWidth: 1,
		width: 248,
		height: 48,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center"
		//margin: 10
	}
});
