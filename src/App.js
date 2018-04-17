/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	AsyncStorage,
	ActivityIndicator
} from "react-native";
import { StackNavigator } from "react-navigation";
import { Router, Scene, Stack } from "react-native-router-flux";

import Login from "./Login";
import CheckIn from "./CheckIn";
import SignUpName from "./SignUpName";
import SignUpEmail from "./SignUpEmail";
import SignUpPassword from "./SignUpPassword";
import Main from "./Main";

class App extends Component<{}> {
	constructor(props) {
		super(props);
		this.state = {
			hasToken: false,
			isLoaded: false,
			name: null
		};
	}

	componentDidMount() {
		AsyncStorage.multiGet(["jwt", "name"]).then(values => {
			const jwt = values[0][1];
			const name = values[1][1];
			this.setState({
				hasToken: jwt !== null,
				isLoaded: true,
				name: name
			});
		});
	}

	render() {
		if (this.state.isLoaded) {
			return (
				<Router>
					<Scene key="root">
						<Scene
							key="main"
							component={Main}
							title="Main"
							initial={!this.state.hasToken}
							hideNavBar="true"
						/>
						<Scene
							key="login"
							component={Login}
							title="Login"
							hideNavBar="true"
						/>
						<Scene
							key="signupname"
							component={SignUpName}
							title="SignUpName"
							hideNavBar="true"
						/>
						<Scene
							key="signupemail"
							component={SignUpEmail}
							title="SignUpEmail"
							hideNavBar="true"
						/>
						<Scene
							key="signuppassword"
							component={SignUpPassword}
							title="SignUpPassword"
							hideNavBar="true"
						/>
						<Scene
							key="checkin"
							component={CheckIn}
							title="CheckIn"
							hideNavBar="true"
							initial={this.state.hasToken}
						/>
					</Scene>
				</Router>
			);
		}
		return (
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="black" />
			</View>
		);
	}
}

export default App;
