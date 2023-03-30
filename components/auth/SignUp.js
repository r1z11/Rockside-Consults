import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  // Save credentials to local storage
  const storeData = async () => {
    let data = {
      email,
      password,
    };

    try {
      if (validateFields()) {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem("rockside_auth_data", jsonValue);
        alert("Credentials saved! Go ahead and login");
        return true;
      } else alert("Make sure all the data has been entered correctly.");
    } catch (e) {
      // saving error
      console.log("Error saving data", e);
      alert("An error occurred while saving your credentials.");
      return false;
    }
  };

  //   Go to sign in screen if credentials are valid
  const register = () => {
    if (validateFields()) {
      if (storeData()) navigation.navigate("SignIn");
    }
  };

  //   Validate email address and password
  const validateFields = () => {
    if (validateEmail() && validatePassword() && validateConfirmPassword())
      return true;
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

  //   Validate email address
  const validateConfirmPassword = () => {
    const valid = password === confirmPassword;

    if (valid) setConfirmPasswordError(false);
    else setConfirmPasswordError(true);

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
        <Text style={styles.title}>Create an account</Text>

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

        <TextInput
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          returnKeyType="done"
          secureTextEntry
          style={styles.textInput}
          textContentType="password"
          placeholder="Confirm password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        {confirmPasswordError ? (
          <Text style={styles.errorText}>Passwords do not match</Text>
        ) : null}

        <Pressable style={styles.btn} onPress={() => register()}>
          <Text style={styles.btnText}>Create account</Text>
        </Pressable>

        <Pressable
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.textBtn}>Already have an account?</Text>
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
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 10,
    paddingVertical: 10,
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
