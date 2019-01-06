import { ThunkResultBase } from "../_shared/LayoutContainer";

export function loginUsingUserPass(email, password): ThunkResultBase {
  return async function(dispatch, getState, extraArguments) {
    var loginUser = {
      email: email,
      password: password
    };

    return extraArguments.loginApi.post(`local/login`, loginUser);
  };
}

export function uploadSimpleImage(uri: string): ThunkResultBase {
  return async function(dispatch, getState, extraArguments) {
    return extraArguments.uploadApi
      .upload("/uploadImage", uri, { fileName: "image.jpg" })
      .then(() => {
        console.log("uploaded");
        console.log(arguments);
      })
      .catch(err => {
        console.log("err");
        console.log(err);
      });
  };
}
