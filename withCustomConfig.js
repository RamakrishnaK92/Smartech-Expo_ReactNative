const {
  ConfigPlugin,
  withInfoPlist,
  withAppDelegate,
  withAndroidManifest,
} = require("expo/config-plugins");

module.exports = (config, id) => {
  console.log("withCustomConfig config", config);
  console.log("withCustomConfig id", id);
  config =  withInfoPlist(config, (config) => {
    if (!config.modResults.NSLocationWhenInUseUsageDescription) {
      config.modResults.NSLocationWhenInUseUsageDescription =
        "We need your location for some even cooler feature!";
    }

    if (!config.modResults.NSLocationAlwaysUsageDescription) {
      config.modResults.NSLocationAlwaysUsageDescription =
        "We need your location for some even cooler feature!";
    }

    if (!config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription) {
      config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
        "We need your location for some even cooler feature!";
    }

    return config;
  });

  config = withInfoPlist(config, (config) => {
    // Add the provided XML code to the info.plist
    const newEntry = {
      CFBundleTypeRole: "Editor",
      CFBundleURLName: "com.netcore.SmartechApp",
      CFBundleURLSchemes: ["hanselpebbletrace"],
    };
    const existingURLTypes = config.modResults.CFBundleURLTypes || [];
    const isNewEntryAlreadyAdded = existingURLTypes.some((entry) => {
      return (
        entry.CFBundleURLName === newEntry.CFBundleURLName &&
        entry.CFBundleURLSchemes.includes(newEntry.CFBundleURLSchemes[0])
      );
    });
    if (!isNewEntryAlreadyAdded) {
      existingURLTypes.push(newEntry);
      config.modResults.CFBundleURLTypes = existingURLTypes;
    }
    return config;
 });
  

  config = withAppDelegate(config, async (config) => {
    const { modResults } = config;
    let { contents } = modResults;
    const myCustomCode = `BOOL handleBySmartech = [[Smartech sharedInstance] application:application openURL:url options:options];
    if(!handleBySmartech) {
        //Handle the url by the app
    }
    return YES;`;
    const lines = contents.split("\n");
    if (contents.includes("openURL:")) {
      const modifiedContents = contents.replace(
        "return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];",
        `
      // Your additional code goes here
      ${myCustomCode}
    `
      );
      console.log("modifiedContents", modifiedContents);
      modResults.contents = modifiedContents;
    }
    return config;
  });

  config = withAndroidManifest(config, async (config) => {
    // Modifiers can be async, but try to keep them fast.
    const locationPermission = {
      $: {
        "android:name": "android.permission.ACCESS_FINE_LOCATION",
      },
    };

    console.log("config.modResults", config.modResults);
    console.log(
      "stringified config.modResults",
      JSON.stringify(config.modResults)
    );

    // Check if <uses-permission> already exists
    const existingPermission = config.modResults["manifest"]["uses-permission"];

    if (Array.isArray(existingPermission)) {
      // Check if permission is already added
      const permissionExists = existingPermission.some((permission) => {
        return (
          permission["$"]["android:name"] === locationPermission["android:name"]
        );
      });

      if (!permissionExists) {
        existingPermission.push(locationPermission);
      }
    } else {
      // Create a new array with the location permission
      config.modResults["manifest"]["uses-permission"] = [locationPermission];
    }
    return config;
  });

  return config;
};
