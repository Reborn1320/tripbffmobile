import { PermissionsAndroid } from "react-native";

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