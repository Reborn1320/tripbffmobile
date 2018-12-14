import Axios from "axios";
import { TRIP_URL } from "../constants";

export var uploadImageAsync: (
  uploadUrl: string,
  authorizationHeader: string,
  uri: string,
  data?: any
) => Promise<any> = uploadImageXmlHttpRequestAsync;

//https://github.com/facebook/react-native/blob/fe42a28de12926c7b3254420ccb85bef5f46327f/Examples/UIExplorer/XHRExample.ios.js#L215-L230
async function uploadImageXmlHttpRequestAsync(
  uploadUrl: string,
  authorizationHeader: string,
  uri: string,
  data: any = undefined
) {
  console.log("authorizationHeader", authorizationHeader);
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  var xhr = new XMLHttpRequest();

  var promise = new Promise((resolve, reject) => {
    xhr.open("POST", TRIP_URL + uploadUrl);

    const UNSENT = 0;
    const OPENED = 1;
    const HEADERS_RECEIVED = 2;
    const LOADING = 3;
    const DONE = 4;

    xhr.onreadystatechange = function(oEvent) {

      if (xhr.readyState === DONE) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
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

    let formData = new FormData();
    formData.append("file", {
      uri,
      name: "image.jpg",
      type: "image/jpg"
    } as any); //todo now bypass skip error
    // formData.append("fileName", "image.jpg");
    if (data) {
      for (var propertyName in data) {
        formData.append(propertyName, data[propertyName]);
      }
    }
    // console.log(formData)

    if (xhr.upload) {
      xhr.upload.onprogress = event => {
        // console.log('upload onprogress', event);
        if (event.lengthComputable) {
          console.log(event.loaded / event.total);
        }
      };
    }

    if (authorizationHeader) {
      console.log("Added Authorization token", authorizationHeader);
      xhr.setRequestHeader("Authorization", authorizationHeader);
    }
    xhr.send(formData);
  });

  return promise;
}

async function uploadImageFetchAsync(uploadUrl: string, uri: string) {
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  // const blob = await getBlobFromUri(uri);
  let formData = new FormData();
  formData.append("photo", {
    uri,
    name: "image.jpg",
    type: "image/jpg"
  });
  console.log(formData);

  let options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    }
  };

  return fetch("http://192.168.1.5:8000" + uploadUrl, options);
}

async function uploadImageAxiosAsync(uploadUrl: string, uri: string) {
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  const blob = await getBlobFromUri(uri);
  console.log(blob);

  const formData = new FormData();
  formData.append("photo", uri, `photo.${fileType}`);
  formData.append("file", new Blob(["test payload"], { type: "text/csv" }));

  const axios = Axios.create({
    //baseURL: `http://192.168.2.101:8000` // local: should use IP4 of current local computer to allow call API from native app
    baseURL: `http://192.168.1.5:8000`
  });

  console.log("uploadImageAxiosAsync");

  return axios.post(uploadUrl, formData, {
    headers: {
      "Content-Type": `multipart/form-data`
    }
  });
}

async function getBlobFromUri(uri: string) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob"; // use BlobModule's UriHandler
    xhr.onload = function() {
      console.log("onload");
      console.log(arguments);
      console.log(xhr.response);
      resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
    };
    xhr.onerror = function() {
      console.log(arguments);
      reject(new TypeError("Network request failed")); // error occurred, rejecting
    };
    xhr.open("GET", uri, true); // fetch the blob from uri in async mode
    xhr.send(null); // no initial data
  });

  // when we're done sending it, close and release the blob
  // blob.close();

  return blob;
}
