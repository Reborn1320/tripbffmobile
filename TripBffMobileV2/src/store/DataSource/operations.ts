import { getAllFeelings as getAllFeelingsAction, 
        getAllActivities as getAllActivitiesAction,
        getAllHighlights as getAllHighlightsAction } from "./actions";
import { ThunkResultBase } from "..";
import { StoreData } from "../Interfaces";
import { LOCALE_VI } from "../../screens/_services/SystemConstants";

export function getAllFeelings(): ThunkResultBase {
    return async function (dispatch, getState, extraArguments): Promise<any> {
  
      return extraArguments.tripApiService.get(`/trips/feelings`)
        .then(res => {
          dispatch(getAllFeelingsAction(res.data));
        })
        .catch(error => {
          console.log("get list of pre-defined feelings error", JSON.stringify(error));
        });    
    };
  }

  export function getAllActivities(): ThunkResultBase {
    return async function (dispatch, getState, extraArguments): Promise<any> {
  
      return extraArguments.tripApiService.get(`/trips/activities`)
        .then(res => {         
           dispatch(getAllActivitiesAction(res.data));
        })
        .catch(error => {
          console.log("get list of pre-defined activities error", JSON.stringify(error));
        });    
    };
  }

  export function getAllHighlights(): ThunkResultBase {
    return async function (dispatch, getState, extraArguments): Promise<any> {
  
      return extraArguments.tripApiService.get(`/trips/highlights`)
        .then(res => {          
           dispatch(getAllHighlightsAction(res.data));
        })
        .catch(error => {
          console.log("get list of pre-defined highlights error", JSON.stringify(error));
        });    
    };
  }