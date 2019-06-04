import axios from "axios";
import { TRIP_URL } from "../ServiceConstants";
var RNFS = require('react-native-fs');

export var uploadImageAsync: (
  uploadUrl: string,
  authorizationHeader: string,
  uri: string,
  data?: any
) => Promise<any> = uploadImageXmlHttpRequestAsync;

//https://ademcan.net/blog/2017/11/24/uploaddownload-images-tofrom-aws-s3-in-react-native-a-step-by-step-guide/
//https://github.com/facebook/react-native/blob/fe42a28de12926c7b3254420ccb85bef5f46327f/Examples/UIExplorer/XHRExample.ios.js#L215-L230
export async function uploadImageXmlHttpRequestAsync(
  uploadUrl: string,
  uri: string,
  mimeType: string,
) {
  var xhr = new XMLHttpRequest();

  var promise = new Promise((resolve, reject) => {
    xhr.open("PUT", uploadUrl);

    const UNSENT = 0;
    const OPENED = 1;
    const HEADERS_RECEIVED = 2;
    const LOADING = 3;
    const DONE = 4;

    xhr.onreadystatechange = function(oEvent) {

      if (xhr.readyState === DONE) {
        console.log("I am done in here", xhr.status);
        if (xhr.status === 200) {
          resolve(true);
        } else {
          console.log("Error status", xhr.status);
          console.log("Error response", xhr.response);
          console.log("Error responseType", xhr.responseType);
          console.log("Error responseText", xhr.responseText);
          console.log("Error statusText", xhr.statusText);
        }
      }
    };

    xhr.onload = () => {
      console.log(xhr.status);
      console.log(xhr.responseText);
      if (xhr.status !== 200) {
        reject(xhr);
        // AlertIOS.alert(
        //   'Upload failed',
        //   'Expected HTTP 200 OK response, got ' + xhr.status
        // );
        return;
      }
      if (!xhr.responseText) {
        reject(xhr);
        // AlertIOS.alert(
        //   'Upload failed',
        //   'No response payload.'
        // );
        return;
      }
      // var index = xhr.responseText.indexOf('http://www.posttestserver.com/');
      // if (index === -1) {
      //   AlertIOS.alert(
      //     'Upload failed',
      //     'Invalid response payload.'
      //   );
      //   return;
      // }
      // var url = xhr.responseText.slice(index).split('\n')[0];
      // LinkingIOS.openURL(url);

      resolve(xhr);
      return;
    };

    let formData = {
      uri,
      name: "image.jpg",
      type: "image/jpg"
    };

    if (xhr.upload) {
      xhr.upload.onprogress = (event: any) => {
        // console.log('upload onprogress', event);
        if (event.lengthComputable) {
          console.log(event.loaded / event.total);
        }
      };
    }

    xhr.setRequestHeader('Content-Type', mimeType);
    // if (authorizationHeader) {
    //   console.log("Added Authorization token", authorizationHeader);
    //   xhr.setRequestHeader("Authorization", authorizationHeader);
    // }
    xhr.send(formData);
  });

  return promise;
}