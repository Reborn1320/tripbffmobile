import { getAllFeelings as getAllFeelingsAction, 
        getAllActivities as getAllActivitiesAction,
        getAllHighlights as getAllHighlightsAction } from "./actions";
import { ThunkResultBase } from "..";
import { tripApiService } from "../ApisAsAService";

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

  export function searchLocations(query: string): Promise<any> {
    var config = {
      params: {
        title: query
      }
    };

    return tripApiService.get(`/trips/searchLocations`, { config })
      .then(res => {    
        return res.data;
      })
      .catch(error => {
        console.log("search locations error", JSON.stringify(error));
      });
  }

  export function getTopNearerLocationsByCoordinate(lat: number, long: number): Promise<any> {
    var config = {
      params: {
        lat,
        long
      }
    };

    return tripApiService.get(`/trips/getTopNearerLocationsByCoordinate`, { config })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        console.log("get nearest location error", JSON.stringify(error));
      });
  }