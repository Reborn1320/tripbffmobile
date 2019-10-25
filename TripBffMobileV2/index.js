/**
 * @format
 */

import { AppRegistry } from 'react-native';
import './i18n';
import App from './App';
import Flurry from 'react-native-flurry-sdk';
import {name as appName} from './app.json';

// Init Flurry once as early as possible recommended in index.js.
// For each platfrom (Android, iOS) where the app runs you need to acquire a unique Flurry API Key.
// i.e., you need two API keys if you are going to release the app on both Android and iOS platforms.
// If you are building for TV platforms, you will need two API keys for Android TV and tvOS.
new Flurry.Builder()
  .withCrashReporting(true)
  .withLogEnabled(true)
  .withLogLevel(Flurry.LogLevel.DEBUG)
  .build("TVNKX5PBS3244R94T3XB", "GV9CB8N9YRTKGXJ9JQW7"); // used only in development environment. Will be updated prod api key when build relese verion.

  // Set users preferences.
Flurry.setAge(36);
Flurry.setGender(Flurry.Gender.FEMALE);
Flurry.setReportLocation(true);
    
// Log Flurry events.
Flurry.logEvent('React Native Event');
Flurry.logEvent('React Native Timed Event', {param: 'true'}, true);

Flurry.endTimedEvent('React Native Timed Event');

// Example to get Flurry Remote Configurations.
Flurry.addConfigListener((event) => {
  if (event.Type === Flurry.ConfigStatus.SUCCESS) {
    // Data fetched, activate it.
    Flurry.activateConfig();
  } else if (event.Type === Flurry.ConfigStatus.ACTIVATED) {
    // Received cached data, or newly activated data.
    Flurry.getConfigString('welcome_message', 'Welcome!').then((value) => {
      console.log((event.isCache ? 'Received cached data: ' : 'Received newly activated data: ') + value.welcome_message);
    });
  } else if (event.Type === Flurry.ConfigStatus.UNCHANGED) {
    // Fetch finished, but data unchanged.
    Flurry.getConfigString('welcome_message', 'Welcome!').then((value) => {
      console.log('Received unchanged data: ' + value.welcome_message);
    });
  } else if (event.Type === Flurry.ConfigStatus.ERROR) {
    // Fetch failed.
    console.log('Fetch error! Retrying: ' + event.isRetrying);
  }
});

Flurry.fetchConfig();
  
AppRegistry.registerComponent(appName, () => App);
