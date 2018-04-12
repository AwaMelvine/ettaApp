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

import Login from "./Login";
import CheckIn from "./CheckIn";

class AppNavigation extends Component<{}> {
	constructor(props) {
		super(props);
		this.getNavigator.bind(this);
	}

	getNavigator() {
		const Navigator = StackNavigator(
			{
				Login: {
					screen: Login,
					navigationOptions: {
						headerLeft: null
					}
				},
				CheckIn: {
					screen: CheckIn,
					navigationOptions: {
						headerLeft: null
					}
				}
			},
			{
				initialRouteName: this.props.initialRouteName
			}
		);
		return <Navigator />;
	}

	render() {
		//let StackNavigator = this.StackNavigator;
		return this.getNavigator();
	}
}

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
				<AppNavigation
					initialRouteName={this.state.hasToken ? "CheckIn" : "Login"}
				/>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF"
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 10
	},
	instructions: {
		textAlign: "center",
		color: "#333333",
		marginBottom: 5
	}
});
