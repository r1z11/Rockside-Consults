import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

export default function SignUp({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
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
        />

        <TextInput
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          returnKeyType="done"
          secureTextEntry
          style={styles.textInput}
          textContentType="password"
          placeholder="Password"
        />

        <TextInput
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          returnKeyType="done"
          secureTextEntry
          style={styles.textInput}
          textContentType="password"
          placeholder="Confirm password"
        />

        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.btnText}>Create account</Text>
        </Pressable>

        <Pressable
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.textBtn}>Already have an account?</Text>
        </Pressable>

        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  safeAreaView: {
    flex: 1,
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
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 7,
    color: "#333",
  },
  spacer30: {
    height: 30,
  },
});
