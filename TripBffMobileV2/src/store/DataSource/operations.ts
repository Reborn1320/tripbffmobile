import { getAllFeelings as getAllFeelingsAction, 
        getAllActivities as getAllActivitiesAction,
        getAllHighlights as getAllHighlightsAction } from "./actions";
import { ThunkResultBase } from "..";
import { StoreData } from "../Interfaces";

export function getAllFeelings(): ThunkResultBase {
    return async function (dispatch, getState, extraArguments): Promise<any> {
  
      return extraArguments.tripApiService.get(`/trips/feelings`)
        .then(res => {
          var rawPredefinedFeelings = res.data as Array<StoreData.PreDefinedFeelingVM>;
          console.log(JSON.stringify(rawPredefinedFeelings));
          //TODO: should based on locale of user setting to define label is label_en or label_vi. For now, default is vi
          var feelings = rawPredefinedFeelings.map(item => {
            return {
              ...item,
              label: item.label_vi
            }
          });
          dispatch(getAllFeelingsAction(feelings));
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