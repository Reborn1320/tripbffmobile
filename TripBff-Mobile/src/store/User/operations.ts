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

    return extraArguments.loginApiService.post({ url: "local/login", data: loginUser })
    .then(res => {
      console.log("user info", res.data);
      // store token into Store
      console.log("token " + res.data.token);
      const { email, token } = res.data;
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