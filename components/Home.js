import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Platform,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const [consent, setConsent] = useState(false);
  const [date, setDate] = useState(new Date().toDateString());
  const [givenName, setGivenName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [comments, setComments] = useState("");

  // Save form data
  const storeData = async () => {
    let data = {
      consent,
      date,
      name: givenName,
      photo: selectedImage,
      location,
      comments,
    };

    try {
      if (validateData) {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem("rockside_form_data", jsonValue);
        console.log("saved", jsonValue);
        alert("Your data has been saved successfully.");
      } else alert("Make sure all the data has been entered correctly.");
    } catch (e) {
      // saving error
      console.log("Error saving data", e);
      alert("An error occurred while saving your data.");
    }
  };

  //   Handle the image picker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  //   Request permission to device storage
  if (status === null) {
    requestPermission();
  }

  useEffect(() => {
    (async () => {
      // Get previous form data from local storage if it exists
      let data = await getData();
      console.log("form data json", data);

      if (data) {
        setConsent(data?.consent);
        setDate(data?.date);
        setGivenName(data?.name);
        setSelectedImage(data?.photo);
        setLocation(data?.location);
        setComments(data?.comments);
      }

      //   If permission granted, get device location when the component mounts
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      console.log("before getting location", location);
      //   Get current position
      let _location = await Location.getCurrentPositionAsync({});
      console.log("before location update", _location);
      //   Update location
      try {
        setLocation(_location);
        console.log("after location update", _location);
      } catch (e) {
        console.log("error updating location state", e);
      }
    })();
  }, []);

  //   Update location status
  let text = "Waiting for location..";
  if (errorMsg) {
    text = errorMsg;
    console.log("location error", text);
  } else if (location) {
    text = JSON.stringify(location);
    console.log("no error. latest location", text);
  }

  //   Validate all form data
  const validateData = () => {
    if (consent && date && givenName.length > 2 && selectedImage && location)
      return true;
    else return false;
  };

  //   Clear local storage and go to sign up screen
  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("SignUp");
    } catch (e) {
      // clear storage error
      console.log("Error clearing local storage", e);
    }
  };

  //   Get form data from local storage
  const getData = async () => {
    try {
      const formData = await AsyncStorage.getItem("rockside_form_data");

      if (formData) {
        // value previously stored
        const data = JSON.parse(formData);
        return data;
      }
    } catch (e) {
      // error reading value
      console.log("Error getting local form data", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 70}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Rockside Questionnaire</Text>

          <View style={styles.spacer30} />

          <Text style={styles.label}>
            Do you consent to be registered on our program?
          </Text>

          {consent ? (
            <Pressable
              style={styles.radioBtnTrue}
              onPress={() => setConsent(!consent)}
            >
              <Text style={styles.btnText}>Yes</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.radioBtnFalse}
              onPress={() => setConsent(!consent)}
            >
              <Text style={styles.btnText}>No</Text>
            </Pressable>
          )}

          {consent ? (
            <View>
              <Text style={styles.label}>Registration date</Text>
              <TextInput
                style={styles.textInput}
                value={date}
                editable={false}
              />

              <Text style={styles.label}>Respondent name</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                style={styles.textInput}
                textContentType="givenName"
                placeholder="Name"
                onChangeText={setGivenName}
                value={givenName}
              />

              <Text style={styles.label}>Respondent picture</Text>
              <Pressable style={styles.imgPickerBtn} onPress={pickImageAsync}>
                <Text>Choose a photo</Text>
              </Pressable>
              {selectedImage ? (
                <View style={styles.photoContainer}>
                  <Image
                    style={styles.photo}
                    source={{ uri: selectedImage }}
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <Text style={styles.label}>Respondent location</Text>
              <Text style={styles.locationText}>{text}</Text>

              <Text style={styles.label}>
                Respondent compound shape and size
              </Text>
              {location !== null ? (
                <MapView
                  provider={PROVIDER_GOOGLE}
                  minZoomLevel={15}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  style={styles.map}
                >
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                  />
                  <Circle
                    radius={500}
                    center={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    strokeWidth={1}
                    strokeColor={"rgba(32, 138, 174, .5)"}
                    fillColor={"rgba(32, 138, 174, .5)"}
                  />
                </MapView>
              ) : null}

              <Text style={styles.label}>Comments (Optional)</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.textInput}
                textContentType="none"
                placeholder="Any comments?"
                numberOfLines={5}
                onChangeText={setComments}
                value={comments}
              />

              <Pressable style={styles.btn} onPress={() => storeData()}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable style={styles.logoutContainer} onPress={() => logOut()}>
            <Text style={styles.textBtn}>Logout and reset credentials</Text>
          </Pressable>

          <StatusBar style="auto" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
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
  label: {
    marginTop: 30,
  },
  radioBtnTrue: {
    borderRadius: 7,
    backgroundColor: "#A5C882",
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "90%",
  },
  radioBtnFalse: {
    borderRadius: 7,
    backgroundColor: "#333",
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "90%",
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
  datePicker: {
    borderRadius: 7,
    backgroundColor: "#eee",
    padding: 10,
    marginTop: 20,
  },
  imgPickerBtn: {
    borderRadius: 7,
    backgroundColor: "#eee",
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  photoContainer: {
    alignItems: "center",
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
  },
  locationText: {
    marginTop: 20,
  },
  map: {
    width: 260,
    height: 260,
    alignSelf: "center",
    marginTop: 20,
  },
  textInput: {
    backgroundColor: "#eee",
    padding: 10,
    marginTop: 20,
    borderRadius: 7,
    color: "#333",
  },
  spacer30: {
    height: 30,
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 30,
  },
});
