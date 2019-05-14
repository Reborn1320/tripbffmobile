import { addToken } from "./actions";
import { StoreData } from "../Interfaces";
import { setAuthorizationHeader } from "../../screens/_services/apis";
import { ThunkResultBase } from "..";
import uuidv4 from "uuid/v4";
import AsyncStorage from "@react-native-community/async-storage";

export function loginUsingUserPass(email: string, password: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    var loginUser = {
      email: email,
      password: password
    };

    return extraArguments.loginApiService.post("local/login", { data: loginUser })
      .then(res => {
        const { user: { id, userName }, token } = res.data;
        console.log(`user info id=${id}, userName=${userName}`);
        console.log("token ", token);

        const user: StoreData.UserVM = {
          username: userName,
          lastName: "asdf",
          firstName: "asdf",
          fullName: "adffff",
          email: email,
          token: token,
        };

        dispatch(addToken(user));
        setAuthorizationHeader(res.data.token);
      })
      .catch(error => {
        console.log("error login", error);
      });
  };
}

export function loginUsingFacebookAccessToken(facebookUserId: string, accessToken: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    var loginUser = {
      access_token: accessToken,
      user_id: facebookUserId
    };

    return extraArguments.loginApiService.post("facebook/verify", { data: loginUser })
      .then(res => {
        const { user: { id, userName, facebook: { accessToken } }, token } = res.data;
        console.log(`user info id=${id}, userName=${userName}`);
        console.log("token ", token);

        const user: StoreData.UserVM = {
          username: userName,
          lastName: "asdf",
          firstName: "asdf",
          fullName: "adffff",
          email: userName,
          token: token,
          facebook: {
            accessToken
          }
        };

        dispatch(addToken(user));
        setAuthorizationHeader(res.data.token);
      })
      .catch(error => {
        console.log("error login", error);
      });
  };
}


export function loginUsingDeviceId(): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    let key = "uniqueDeviceUUID";
    let uniqueDeviceUuid = await getDataFromStorage(key);

    if (!uniqueDeviceUuid) {
      uniqueDeviceUuid = uuidv4();
      await storeDataIntoStorage(key, uniqueDeviceUuid);
    }

    console.log('uuid: ' + uniqueDeviceUuid);

    var loginUser = {
      uniqueDeviceId: uniqueDeviceUuid
    };

    return extraArguments.loginApiService.post("device/login", { data: loginUser })
      .then(res => {
        const { user: { id, userName }, token } = res.data;
        console.log(`user info id=${id}, userName=${userName}`);
        console.log("token ", token);

        const user: StoreData.UserVM = {
          username: userName,
          lastName: "asdf",
          firstName: "asdf",
          fullName: "adffff",
          email: userName,
          token: token,
        };

        dispatch(addToken(user));
        setAuthorizationHeader(res.data.token);
      })
      .catch(error => {
        console.log("error login", error);
      });
  };
}

async function storeDataIntoStorage(key, value) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }

  console.log('Done store data');
}

async function getDataFromStorage(key) {
  let value = '';

  try {
    value = await AsyncStorage.getItem(key)
  } catch (e) {
    // error reading value
  }

  console.log('Done get data');

  return value;
}