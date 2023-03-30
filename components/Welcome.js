import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";

const logo = require("../assets/logo.jpg");

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
        
      <Image style={styles.logo} source={logo} />
      <Text style={styles.title}>Rockside Consults</Text>
      <Text style={styles.subtitle}>Technical Assessment</Text>

      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.btnText}>Get Started</Text>
      </Pressable>

      <StatusBar style="auto" />
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
  logo: {
    height: 100,
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
  },
  btnText: {
    color: "#fff",
    fontSize: 19,
  },
});
