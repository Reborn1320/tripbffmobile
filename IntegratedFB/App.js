/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, CameraRoll, PermissionsAndroid} from 'react-native';
import {
  ShareDialog,    
  AccessToken,
  LoginManager
} from "react-native-fbsdk";
import { isTSEnumMember } from '@babel/types';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  _requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  _sharePhotoWithShareDialog = async () => {
    var tmp = this;  

    //await this._requestCameraPermission();

    let photosOfCamera = await CameraRoll.getPhotos({ first: 8 });
    let photos = photosOfCamera.edges.map(item => {
      return {  imageUrl: item.node.image.uri }
    });

    const sharePhotoContent = {
      contentType: "photo",
      photos: photos
    };

   AccessToken.getCurrentAccessToken().then(
       (data) => {
         if (data) {
           try{
             ShareDialog.canShow(sharePhotoContent)
             .then(function(canShow) {
               if (canShow) {
                 return ShareDialog.show(sharePhotoContent)                    
               }
             })
             .then(
               function(result) {
                 console.log("Share result: " + JSON.stringify(result));
                 if (result.isCancelled) {
                   console.log("Share cancelled");
                 } else {
                   console.log("Share success");
                   this._navigateToProfile();
                 }
               },
               function(error) {
                 console.log("Share fail with error: " + error);
               }
             );
           }
           catch(error) {
               console.log('come here error try catch');
           }
           
         }
         else {
             console.log('need to log-in');
             LoginManager.logInWithReadPermissions(["public_profile", "user_photos", "user_posts"]).then(
               function(result) {
                 if (result.isCancelled) {
                   console.log("Login cancelled");
                 } else {
                   console.log(
                     "Login success with permissions: " +
                       result.grantedPermissions.toString()
                   );
                   tmp._sharePhotoWithShareDialog();
                 }
               },
               function(error) {
                 console.log("Login fail with error: " + error);
               }
             );
         }
       } 
     );    
   }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Share Dialog11"
         onPress={this._sharePhotoWithShareDialog}>
            </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
