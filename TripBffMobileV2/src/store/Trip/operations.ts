import { 
  removeLocation as removeLocationAction, 
  addLocation as addLocationAction,
  updateLocationFeeling as updateLocationFeelingAction,
  updateLocationActivity as updateLocationActivityAction,
  updateLocationAddress as updateLocationAddressAction,
  updateLocationHighlight as updateLocationHighlightAction,
  updateLocationDescription as  updateLocationDescriptionAction,
  addLocationImage as addLocationImageAction,
  updateLocationImages,
  favorLocationImage as favorLocationImageAction,
  uploadLocationImage as uploadLocationImageAction,
  importSelectedLocations,
  updateTrip as updateTripAction,
  replaceTrip,
  createTrip as createTripAction
} from "./actions";
import { ThunkResultBase } from "..";
import { Moment } from "moment";
import { StoreData, RawJsonData } from "../Interfaces";
import moment from "moment";
import { uploadImageXmlHttpRequestAsync } from "../../screens/_services/Uploader/BlobUploader";
import { toDateUtc as toDateUtcFunc } from "../../_function/dateFuncs";

export function fetchTrip(tripId: string, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    var args = {
      data: {
        cancelToken: cancelToken
      }
    }

    return extraArguments.tripApiService.get(`trips/${tripId}`, args)
      .then(res => {
        var rawTrip: RawJsonData.TripVM = res.data;
        var trip: StoreData.TripVM = {
          tripId: rawTrip.tripId,
          name: rawTrip.name,
          fromDate: moment(rawTrip.fromDate).local(),
          toDate: moment(rawTrip.toDate).local(),
          rawLocations: rawTrip.locations,
          infographicId: rawTrip.infographicId,
          createdById: rawTrip.createdById
        };
        //console.log('current trip: ' + JSON.stringify(trip));
        dispatch(replaceTrip(trip));

        return trip;
      })
      .catch(error => {
        console.log("fetch trip error", error);
      });
  };
}

export function removeLocation(tripId: string, dateIdx: number, locationId: string, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    var args = {
      config: {
        cancelToken: cancelToken
      }
    }
    
    return extraArguments.tripApiService.delete(`trips/${tripId}/locations/${locationId}`, args)
      .then(res => {
        dispatch(removeLocationAction(tripId, dateIdx, locationId));
      })
      .catch(error => {
        console.log("removeLocation error", error);
      });
  };
}

export type IImportLocation = {
  name: string,
  location: {
      long: number
      lat: number
      address: string
  },
  fromTime: moment.Moment
  toTime: moment.Moment
  images: {
      url: string, //url stored in local mobile
      time: Moment,
  }[]
}

export function addLocations(tripId, selectedLocations: IImportLocation[]): ThunkResultBase {
  return function (dispatch, getState, extraArgument): Promise<any> {
    // call API to import locations and images
    var url = '/trips/' + tripId + '/locations';
    console.log(`fetch: ${url}`)
    return extraArgument.tripApiService
      .post(url, { data: selectedLocations })
      .then((res) => {
        console.log("import trip succeeded")
        console.log('result after import trip: ', res.data);

        var rawLocations = res.data.locations.map(item => ({
            ...item,
            fromTime: moment(item.fromTime).local(),
            toTime: moment(item.toTime).local()
        }));

        dispatch(importSelectedLocations(tripId, rawLocations));
        // this.setState({ UIState: "import images" })
      })
      .catch(function (error) {
        // console.log(JSON.stringify(error));
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //   console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

  }
}

export function addLocation(tripId: string, dateIdx: number, location: StoreData.LocationVM, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    
    var data = {
        name: location.name,
        fromTime: toDateUtcFunc(location.fromTime.clone()),
        toTime: toDateUtcFunc(location.toTime.clone()),
        location: location.location,
        images: location.images
    };

    var config = {
      cancelToken: cancelToken
    };

    return extraArguments.tripApiService.post(`trips/${tripId}/locations/addLocation`, { data, config})
      .then(res => {
        if (res.data.isSucceed) {
          location.locationId = res.data.data;
          console.log('new added location id: ' + res.data.data);
          dispatch(addLocationAction(tripId, dateIdx, location));
        }
        else if (res.data.errors.length > 0) {
          throw new Error(res.data.errors[0]);
        }
        else {
          throw new Error('Get error when add new location!');
        }
      })
      .catch(error => {
        console.log("add location error", JSON.stringify(error));
      });    
  };
}

export function createTrip(name: string, fromDate: Moment, toDate: Moment): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    let fromDateUtc = toDateUtcFunc(fromDate.clone());
    let toDateUtc = toDateUtcFunc(toDate.clone());

    var data = {
      name, fromDate: fromDateUtc, toDate: toDateUtc
    }
    return extraArguments.tripApiService.post('/trips', { data })
    .then((res) => {
      const tripId: string = res.data;
      console.log('trip id: ', tripId);
      var trip = {
        tripId: tripId,
        name: name,
        fromDate: fromDate,
        toDate: toDate
      };
      dispatch(createTripAction(trip));
      return tripId;
    })
    .catch((err) => {
      console.log('error create trip api: ', err);
    });
  };
}

export function updateTrip(tripId: string,name: string, fromDate: Moment, toDate: Moment): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    let fromDateUtc = toDateUtcFunc(fromDate.clone());
    let toDateUtc = toDateUtcFunc(toDate.clone());

    var data = {
      name, fromDate: fromDateUtc, toDate: toDateUtc
    }
    return extraArguments.tripApiService.patch('/trips/' + tripId, { data })
    .then((res) => {
       const trip: RawJsonData.TripVM = res.data;
       //todo need a proper conversion
       dispatch(updateTripAction(tripId, name, fromDate, toDate, trip.locations));
    })
    .catch((err) => {
      console.log('error update trip api: ', err);
    });
  };
}

export function updateLocationFeeling(tripId: string, dateIdx: number, locationId: string, feeling: StoreData.FeelingVM, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = feeling;
    var config = {
      cancelToken: cancelToken
    };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/feeling`, { data, config })
    .then((res) => {
      dispatch(updateLocationFeelingAction(tripId, dateIdx, locationId, feeling));
    })
    .catch((err) => {
      console.log('error update location feeling: ', err);
    });
  };
}

export function updateLocationActivity(tripId: string, dateIdx: number, locationId: string, activity: StoreData.ActivityVM, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = activity;
    var config = {
      cancelToken: cancelToken
    };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/activity`, { data, config })
    .then((res) => {
      dispatch(updateLocationActivityAction(tripId, dateIdx, locationId, activity));
    })
    .catch((err) => {
      console.log('error update location activity: ', err);
    });
  };
}

export function updateLocationAddress(tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      name: location.name,
      address: location.address,
      long: location.long,
      lat: location.lat
    };
    let config = {
      cancelToken: cancelToken
    };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/address`, { data, config })
    .then((res) => {
      dispatch(updateLocationAddressAction(tripId, dateIdx, locationId, location));
    })
    .catch((err) => {
      console.log('error update location address: ', err);
    });
  };
}


export function updateLocationHighlight(tripId: string, dateIdx: number, locationId: string, highlights: Array<StoreData.LocationLikeItemVM>, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = [...highlights];
    let config = { cancelToken: cancelToken };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/highlights`, { data, config })
    .then((res) => {
      dispatch(updateLocationHighlightAction(tripId, dateIdx, locationId, highlights));
    })
    .catch((err) => {
      console.log('error update location highlights: ', err);
    });
  };
}

export function updateLocationDescription(tripId: string, dateIdx: number, locationId: string, description: string, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = { description };
    let config = { cancelToken: cancelToken };
    return extraArguments.tripApiService.patch(`/trips/${tripId}/locations/${locationId}/description`, { data, config })
    .then((res) => {
      dispatch(updateLocationDescriptionAction(tripId, dateIdx, locationId, description));
    })
    .catch((err) => {
      console.log('error update location description: ', err);
    });
  };
}

export function deleteMultiLocationImages(tripId: string, dateIdx: number, locationId: string,
  imageIds: string[], cancelToken: any): ThunkResultBase {
    console.log("DELETE location images", imageIds);
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      deletingIds: imageIds
    };
    let config = {
      cancelToken: cancelToken
    };
    return extraArguments.tripApiService
    .patch(`/trips/${tripId}/locations/${locationId}/images`, { data, config })
    .then((res) => {
      const location: StoreData.LocationVM = res.data;
      dispatch(updateLocationImages(tripId, dateIdx, locationId, location.images));
    })
    .catch((err) => {
      console.log('error delete multiple location images: ', err);
    });
  };
}

export function favorLocationImage(tripId: string, dateIdx: number, locationId: string, imageId: string, isFavorite: boolean): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      isFavorite
    };
    return extraArguments.tripApiService
    .patch(`/trips/${tripId}/locations/${locationId}/images/${imageId}`, { data })
    .then((res) => {
      // console.log("return data", res)
      dispatch(favorLocationImageAction(tripId, dateIdx, locationId, imageId, isFavorite));
    })
    .catch((err) => {
      console.log('error favorLocationImage: ', err);
    });
  };
}

export function addLocationImage(tripId: string, dateIdx: number, locationId: string, imgUrl: string, time: Moment, cancelToken: any): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {
    const data = {
      url: imgUrl,
      time
    };
    let config = {
      cancelToken: cancelToken
    };

    return extraArguments.tripApiService
    .post(`/trips/${tripId}/locations/${locationId}/images`, { data, config })
    .then((res) => {
      // console.log("return data", res)
      const imageId = res.data;
      console.log("new image id", res.data);
      dispatch(addLocationImageAction(tripId, dateIdx, locationId, imageId, imgUrl, time));

      return imageId;
    })
    .catch((err) => {
      console.log('error addLocationImage: ', err);
    });
  };
}

export function updateInfographicStatus(tripId: string, infographicId: string): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {        
    console.log('tripId: ' + tripId);
    console.log('infographicId: ' + infographicId);
    return extraArguments.tripApiService.patch(`/trips/${tripId}/infographics/${infographicId}/share`)
    .then((res) => {      
    })
    .catch((err) => {
      console.log('error update infographic status: ', err);
    });
  };
}


/**
 * this method is only used in testing upload image generically
 *
 * @export
 * @param {string} imgUrl
 * @param {StoreData.IMimeTypeImage} [mimeType="image/jpeg"]
 * @returns {ThunkResultBase}
 */
export function uploadImage(imgUrl: string, mimeType: StoreData.IMimeTypeImage = "image/jpeg"): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    const data = {
      mimeType
    };
    const signResult: { signedRequest: string, externalId: string, fullPath: string } = 
    await extraArguments.tripApiService
    .get(`/images/preUploadImage?mimeType=${mimeType}`)
    .then(res => res.data);

    console.log(signResult);

    return uploadImageXmlHttpRequestAsync(signResult.signedRequest, imgUrl, mimeType)
    .then(() => {
      const data = {
        fullPath: signResult.fullPath,
      };
      
      return extraArguments.tripApiService
      .post("images", { data })
      .then(res => res.data);
    })
    .catch((err) => {
        console.log('error uploadImage ', err);
        return false;
    });
  };
}

export function uploadLocationImage(
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,
    imgUrl: string,
    cancelToken: any,
    mimeType: StoreData.IMimeTypeImage = "image/jpeg"
    ): ThunkResultBase {
  return async function (dispatch, getState, extraArguments): Promise<any> {

    const signResult: { signedRequest: string, externalId: string, fullPath: string } = 
    await extraArguments.tripApiService
    .get(`/trips/${tripId}/preUploadImage?mimeType=${mimeType}`)
    .then(res => res.data);

    console.log("signResult", signResult);
    console.log("mimeType", mimeType);
    return uploadImageXmlHttpRequestAsync(signResult.signedRequest, imgUrl, mimeType)
    .then(() => {
      console.log("complete upload to s3");

      const additionalData = {
        locationId,
        imageId,
        fullPath: signResult.fullPath,
      };
      let config = {
        cancelToken: cancelToken
      }
      var url = '/trips/' + tripId +'/uploadImage';
  
      return extraArguments.tripApiService
      .post(url, { data: additionalData, config })
      .then((res) => {
          var { externalId, thumbnailExternalUrl, externalUrl } = res.data;
          dispatch(uploadLocationImageAction(tripId, dateIdx, locationId, imageId, externalId, thumbnailExternalUrl, externalUrl));
          return true;
      })
      .catch((err) => {
          console.log('error uploadLocationImage ', err);
          return false;
      });

    })
    .catch((err) => {
        console.log('error uploadImage ', err);
        return false;
    });

  };
  
}