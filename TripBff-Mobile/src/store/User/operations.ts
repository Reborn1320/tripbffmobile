import { ThunkResultBase } from "../../../_shared/LayoutContainer";
import { StoreData } from "../../../../Interfaces";
import { setAuthorizationHeader } from "../../../_services/apis";
import { addToken } from "./actions";


export function loginUsingUserPass(email: string, password: string): ThunkResultBase {
  return async function(dispatch, getState, extraArguments): Promise<any> {
    var loginUser = {
      email: email,
      password: password
    };

    return extraArguments.loginApi.post(`local/login`, loginUser)
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