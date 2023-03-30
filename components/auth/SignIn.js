import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  //   Get credentials from local storage
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("rockside_auth_data");
      if (value !== null) {
        // value previously stored
        const data = JSON.parse(value);
        return data;
      }
    } catch (e) {
      // error reading value
      console.log("Error getting local data", e);
    }
  };
  //   Get credentials from local storage when the component mounts
  useEffect(() => {
    (async () => {
      let data = await getData();
      console.log("credentials", data);
      if (data) {
        setEmail(data.email);
        setPassword(data.password);
      }
    })();
  }, []);

  //   Go to home screen if credentials match
  const login = () => {
    if (validateFields()) {
      navigation.navigate("Home");
    }
  };

  //   Validate email address and password
  const validateFields = () => {
    if (validateEmail() && validatePassword()) return true;
    else return false;
  };

  //   Validate email address
  const validateEmail = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = re.test(email);

    if (valid) setEmailError(false);
    else setEmailError(true);

    return valid;
  };

  //   Validate email address
  const validatePassword = () => {
    const valid = password.length > 5;

    if (valid) setPasswordError(false);
    else setPasswordError(true);

    return valid;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "position" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 70}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.spacer30} />

        <TextInput
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          style={styles.textInput}
          textContentType="username"
          placeholder="Email address"
          onChangeText={setEmail}
          value={email}
        />
        {emailError ? (
          <Text style={styles.errorText}>Invalid email address</Text>
        ) : null}

        <TextInput
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          returnKeyType="done"
          secureTextEntry
          style={styles.textInput}
          textContentType="password"
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
        />
        {passwordError ? (
          <Text style={styles.errorText}>
            Password should be atleast 6 characters
          </Text>
        ) : null}

        <Pressable style={styles.btn} onPress={() => login()}>
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>

        <Pressable
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.textBtn}>Don't have an account?</Text>
        </Pressable>

        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 27,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 19,
    marginTop: 20,
  },
  btn: {
    borderRadius: 7,
    backgroundColor: "#333",
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "80%",
  },
  btnText: {
    color: "#fff",
    fontSize: 19,
    textAlign: "center",
  },
  textBtn: {
    color: "#666",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  textInput: {
    backgroundColor: "#ddd",
    padding: 10,
    marginTop: 20,
    borderRadius: 7,
    color: "#333",
    width: "80%",
  },
  spacer30: {
    height: 30,
  },
  errorText: {
    color: "#C1292E",
    marginTop: 10,
  },
});
