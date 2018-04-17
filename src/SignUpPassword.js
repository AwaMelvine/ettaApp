import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Keyboard
} from "react-native";
import { Actions } from "react-native-router-flux";

export default class SignUpPassword extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      password: "",
      error: null,
      hasLoaded: true
    };

    this.onRegister = this.onRegister.bind(this);
  }

  onRegister() {
    this.setState({ hasLoaded: false });
    Keyboard.dismiss();
    const data = {
      name: this.state.firstName.trim() + " " + this.state.lastName.trim(),
      //firstName: this.state.firstName.trim(),
      //lastName: this.state.lastName.trim(),
      email: this.state.email.trim(),
      password: this.state.password.trim()
    };
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
          Actions.checkin({
            name: this.state.name,
            email: this.state.email
          });
        }
        this.setState({ hasLoaded: true });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerText}>
          <Text style={styles.titleSubtitle}>STAY SAFE</Text>
          <Text style={styles.titleText}>Your Password</Text>
        </View>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.inputBox}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            underlineColorAndroid={"rgba(0,0,0,0)"}
            placeholder="Password"
            placeholderTextColor="#6A6A6A"
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
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.nextButton} onPress={this.onRegister}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => Actions.pop()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  headerText: {
    //flexGrow: 1,
    width: 300,
    alignItems: "flex-start",
    marginTop: 50
  },
  titleSubtitle: {
    color: "#99A3A4",
    fontSize: 16,
    fontWeight: "bold"
  },
  titleText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#000000"
  },
  inputArea: {
    //flexGrow: 1,
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
  nextButton: {
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
  nextButtonText: {
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
