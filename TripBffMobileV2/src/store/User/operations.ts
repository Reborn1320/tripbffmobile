import { addToken } from "./actions";
import { StoreData } from "../Interfaces";
import { setAuthorizationHeader } from "../../screens/_services/apis";
import { setAuthorizationHeader as setAuthorizationHeader2 } from "../../store/ApisAsAService";
import { ThunkResultBase } from "..";
import uuidv4 from "uuid/v4";
import AsyncStorage from "@react-native-community/async-storage";

export function loginUsingUserPass(email: string, password: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    if ((await loadLoggedUser(dispatch))) return;

    var loginUser = {
      email: email,
      password: password
    };

    return extraArguments.loginApiService.post("local/login", { data: loginUser })
      .then(res => {
        const { user: { id, userName, fullName }, token } = res.data;
        console.log(`user info id=${id}, userName=${userName}`);
        console.log("token ", token);

        const user: StoreData.UserVM = {
          id: id,
          username: userName,
          fullName: "adffff",
          email: email,
          token: token,
        };

        dispatch(addToken(user));
        setAuthorizationHeader(user.token);
        setAuthorizationHeader2(user.token);
        storeDataIntoStorage(STORAGE_KEYS.USER, JSON.stringify(user));
      })
      .catch(error => {
        console.log("error login", error);
      });
  };
}

export function loginUsingFacebookAccessToken(facebookUserId: string, accessToken: string, userId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    var loginUser = {
      access_token: accessToken,
      user_id: facebookUserId,
      logged_user_id: userId
    };

    return extraArguments.loginApiService.post("facebook/verify", { data: loginUser })
      .then(res => {
        const { user: { id, userName, fullName, facebook: { accessToken } }, token } = res.data;
        console.log(`user info id=${id}, userName=${userName}`);
        console.log("token ", token);

        const user: StoreData.UserVM = {
          id: id,
          username: userName,
          fullName: fullName,
          email: userName,
          token: token,
          facebook: {
            accessToken
          }
        };

        dispatch(addToken(user));
        setAuthorizationHeader(user.token);
        setAuthorizationHeader2(user.token);
        storeDataIntoStorage(STORAGE_KEYS.USER, JSON.stringify(user));

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
      .then(async (res) => {
        const { user: { id, userName }, token } = res.data;
        console.log(`user info id=${id}, userName=${userName}`);
        console.log("token ", token);

        const user: StoreData.UserVM = {
          id: id,
          username: userName,
          fullName: "Quest",
          email: userName,
          token: token,
        };

        dispatch(addToken(user));
        setAuthorizationHeader(user.token);
        setAuthorizationHeader2(user.token);
        await storeDataIntoStorage(STORAGE_KEYS.USER, JSON.stringify(user));
      })
      .catch(error => {
        console.log("error login", error);
      });
  };
}

export function isLoggedIn(): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    return await loadLoggedUser(dispatch); 
  };
}

export async function logOut() {
  return await AsyncStorage.removeItem(STORAGE_KEYS.USER);
}

async function loadLoggedUser(dispatch) {
  const user: StoreData.UserVM = JSON.parse(await getDataFromStorage(STORAGE_KEYS.USER));
  if (user == null) return false;

  dispatch(addToken(user));
  setAuthorizationHeader(user.token);
  setAuthorizationHeader2(user.token);
  return true;
}

async function storeDataIntoStorage(key, value) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
    console.error("store data failed", e)
  }
}

async function getDataFromStorage(key) {
  try {
    return AsyncStorage.getItem(key)
  } catch (e) {
    // error reading value
    console.log("error reading value", e);
  }
}

const STORAGE_KEYS = {
  USER: "LoggedUser"
}
