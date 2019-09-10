import { ThunkResultBase } from "../../store";

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
