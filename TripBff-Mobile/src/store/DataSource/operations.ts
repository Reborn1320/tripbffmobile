import { getAllFeelings as getAllFeelingsAction } from "./actions";
import { ThunkResultBase } from "..";

export function getAllFeelings(): ThunkResultBase {
    return async function (dispatch, getState, extraArguments): Promise<any> {
  
      return extraArguments.api.get(`/trips/feelings`)
        .then(res => {
           dispatch(getAllFeelingsAction(res.data));
        })
        .catch(error => {
          console.log("get list of pre-defined feelings error", JSON.stringify(error));
        });    
    };
  }