import { PermissionsAndroid } from "react-native";
import axios from "axios";
import { func } from "prop-types";
const CancelToken = axios.CancelToken;
var RNFS = require('react-native-fs');
import _, { } from "lodash";
import { LOCALES } from "../screens/_services/SystemConstants";

export function getAddressFromLocation (locationJson) {
    let address = "";

    if (locationJson.address) {
        let houseNumber = locationJson.address.house_number,
            road = locationJson.address.road,
            suburb = locationJson.address.suburb,
            county = locationJson.address.county,
            city = locationJson.address.city,
            country = locationJson.address.country;

        if (houseNumber) address = houseNumber
        if (road) address = address ? address + ', ' + road : road;
        if (suburb) address = address ? address + ', ' + suburb : suburb;
        if (county) address = address ? address + ', ' + county : county;
        if (city)  address = address ? address + ', ' + city : city;
        if (country) address = address ? address + ', ' + country : country;         
    }
    else
        address = locationJson.display_name;

    return address;
}

export async function checkAndRequestPhotoPermissionAsync() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE        
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read external storage');
      } else {
        console.log('Read external storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

export async function runPromiseSeries(promises) { 
  var p = Promise.resolve();
  return promises.reduce(function(pacc, fn) {
    return pacc = pacc.then(fn);
  }, p);
}

export function calculateByPercentage(value, percentage) {
  const result = (percentage * value) / 100;
  return Math.round(result);
}

export function getCancelToken(cancelRequest) {
  var cancelToken = new CancelToken(function executor(c) {
    cancelRequest = c;
  })

  return { cancelToken, cancelRequest };
}

export async function deleteFileInLocalStorate(folderPath, fileName) {
  var filePath = RNFS.DocumentDirectoryPath + `/${folderPath}/${fileName}`;

  RNFS.unlink(filePath)
      .then(() => {
        console.log('FILE DELETED: ' + filePath);
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      });
}

export async function deleteFilesInFolder(folderPath) {
  RNFS.readDir(RNFS.DocumentDirectoryPath + `/${folderPath}`)
      .then((result) => {
          console.log('all storaged images: ' + JSON.stringify(result));
          _.each(result, file => {
              deleteFileInLocalStorate(folderPath, file.name);            
          });
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });;
}

export function createLabelLocales(label) {
  var item = {};

  LOCALES.forEach(locale => {
    item["label_" + locale.locale] = label;
  });

  return item;
}
