import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard
} from "react-native";
import { Actions } from "react-native-router-flux";

export default class SignUpName extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      error: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const invalid = this.state.firstName === "" || this.state.lastName === "";
    if (invalid) {
      this.setState({ error: "Please fill in both name fields" });
    } else {
      Actions.signupemail(this.state);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerText}>
          <Text style={styles.titleSubtitle}>WHO ARE YOU</Text>
          <Text style={styles.titleText}>Your Name</Text>
        </View>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.inputBox}
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
            underlineColorAndroid={"rgba(0,0,0,0)"}
            placeholder="First Name"
            placeholderTextColor="#6A6A6A"
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
            underlineColorAndroid={"rgba(0,0,0,0)"}
            placeholder="Last Name"
            placeholderTextColor="#6A6A6A"
          />
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
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              Keyboard.dismiss();
              this.onSubmit();
            }}
          >
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
