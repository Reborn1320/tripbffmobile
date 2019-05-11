import { addToken } from "./actions";
import { StoreData } from "../Interfaces";
import { setAuthorizationHeader } from "../../screens/_services/apis";
import { ThunkResultBase } from "..";

export function loginUsingUserPass(email: string, password: string): ThunkResultBase {
  return async function(dispatch, getState, extraArguments): Promise<any> {
    var loginUser = {
      email: email,
      password: password
    };

    return extraArguments.loginApiService.post("local/login", { data: loginUser })
    .then(res => {
      const { user: { id, email }, token } = res.data;
      console.log(`user info id=${id}, userName=${email}`);
      console.log("token ", token);

      const user: StoreData.UserVM = {
        username: email,
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
  return async function(dispatch, getState, extraArguments): Promise<any> {
    var loginUser = {
      access_token: accessToken,
      user_id: facebookUserId
    };

    return extraArguments.loginApiService.post("facebook/verify", { data: loginUser })
    .then(res => {
      const { user: { id, email }, token } = res.data;
      console.log(`user info id=${id}, userName=${email}`);
      console.log("token ", token);

      const user: StoreData.UserVM = {
        username: email,
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