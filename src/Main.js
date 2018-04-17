import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Easing
} from "react-native";
import { Actions } from "react-native-router-flux";

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.logoShift = new Animated.Value(-100);
    this.logoFade = new Animated.Value(0);
    this.buttonsShift = new Animated.Value(200);
    this.textFade = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.stagger(0, [
      Animated.timing(this.textFade, {
        toValue: 1,
        duration: 1000
      }),
      Animated.timing(this.logoFade, {
        toValue: 1,
        duration: 1000
      }),
      Animated.timing(this.logoShift, {
        toValue: 0,
        duration: 500,
        easing: Easing.in
      }),
      Animated.timing(this.buttonsShift, {
        toValue: 0,
        duration: 500,
        easing: Easing.in
      })
    ]).start();
  }

  shiftLogo() {
    Animated.timing(this.logoShift, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear
    }).start();
  }
  shiftButtons() {
    Animated.timing(this.buttonsShift, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear
    }).start();
  }
  fadeText() {
    Animated.timing(this.textFade, {
      toValue: 1,
      duration: 1000
    }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Animated.Image
            style={{
              width: 150,
              height: 150,
              opacity: this.logoFade,
              transform: [{ translateY: this.logoShift }]
            }}
            source={require("../assets/stopwatch.png")}
          />
        </View>
        <View style={styles.buttons}>
          <View style={styles.title}>
            <Animated.Text
              style={[styles.titleText, { opacity: this.textFade }]}
            >
              E.T.T.A
            </Animated.Text>
          </View>
          <Animated.View
            style={{ transform: [{ translateY: this.buttonsShift }] }}
          >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => Actions.login()}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => Actions.signupname()}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const Stopwatch = () => {
  return <View style={styles.stopwatch} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  logo: {
    flexGrow: 1,
    marginTop: 200
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    height: 200
  },
  titleText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#000000"
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
  signUpButton: {
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
  signupButtonText: {
    fontFamily: "Helvetica",
    color: "grey",
    fontSize: 18,
    fontWeight: "bold"
  }
});
