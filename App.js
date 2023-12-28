import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  Platform,
} from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import DeepLinkReducer from "./src/component/DeeplinkReducer";
const store = createStore(DeepLinkReducer);
import SmartechStackNavigator from "./src/navigation/SmartechStackNavigator";
import * as Notifications from "expo-notifications";
import Geolocation from "react-native-geolocation-service";
const SmartechPushSdk = require("smartech-push-react-native");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  function setupSmartech() {
    console.log("Hello Smartech");
  }

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     // SmartechPushSdk.handlePushNotificationMessage(notification.request.trigger.remoteMessage.data);
  //     //setNotification(notification);
  //   });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  async function requestLocationPermission() {
    if (Platform.OS === "android") {
      console.log("Android clicked ");
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Example App",
            message: "Example App access to your location ",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
        } else {
          console.log("location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      requestLocationPermissioniOS();
    }
  }

  const requestLocationPermissioniOS = async () => {
    const auth = Geolocation.requestAuthorization("always");
    auth.then(function (RESULTS) {
      console.log("IOS clicked ", RESULTS);
      if (RESULTS == "granted") {
        console.log("You can use the location");
      }
      else {
        console.log("location permission denied");
      }
    });
  };

  requestLocationPermission();
  setupSmartech();

  return (
    <Provider store={store}>
      <SmartechStackNavigator />
    </Provider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  // if (Device.isDevice) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  // console.log(token);

  let FCMtoken = (await Notifications.getDevicePushTokenAsync()).data;

  console.log("FCMtoken", FCMtoken);

  SmartechPushSdk.setDevicePushToken(FCMtoken, () => {
    console.log("Device Push Token Error = ", error);
  });
}
// else {
//   alert('Must use physical device for Push Notifications');
// }

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import HomeTabNavigator from './src/navigation/HomeTabNavigator.js';
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <HomeTabNavigator/>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });