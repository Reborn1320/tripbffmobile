import React, { Component } from "react";
import { StoreData } from "../../../Interfaces";
import _ from "lodash";
import 'react-native-console-time-polyfill';

import moment from "moment";
import { uploadedImage } from "./actions";
import Loading from "../../_components/Loading";
import { ThunkDispatch } from 'redux-thunk';
import { TripImportLocationVM } from "./TripImportViewModels";
import { uploadFileApi } from "../../_services/apis";
import { PropsBase, ThunkResultBase } from "../../_shared/LayoutContainer";

type ThunkResult<R> = ThunkResultBase<R, State>;

export interface Props extends IMapDispatchToProps, PropsBase {
  dispatch: ThunkDispatch<State, null, any>
  trip: StoreData.TripVM
}

interface IMapDispatchToProps {
  // importImageSelectUnselectImage: (tripId: number, locationIdx: number, imageIdx: number) => void
  // importImageSelectUnselectAllImages: (tripId: number, locationIdx: number) => void
  importSelectedLocations: (tripId: number, locations: StoreData.LocationVM[]) => void
}

interface State {
  tripId: string
  name: string
  fromDate: moment.Moment
  toDate: moment.Moment
  locations: TripImportLocationVM[]
  isLoading: boolean
  loadingMessage: string
  forceUpdateOnlyItemIdx?: number
  UIState: UIState
}

type UIState = "select image" | "import images" | "uploading image"

export class ImagesUploader extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tripId: props.trip.tripId,
      name: props.trip.name,
      fromDate: props.trip.fromDate,
      toDate: props.trip.toDate,
      locations: [],
      isLoading: true,
      loadingMessage: "Loading image from your gallery",
      UIState: "select image"
    }

    console.log("constructor")
  }

  async componentDidMount() {
    this.setState({ locations: adapterResult, isLoading: false });
  }

  _uploadImage = function uploadImage(tripId, locationId, imageId, imgUrl): ThunkResult<Promise<any>> {
    return async function (dispatch) {
      console.log(`imge url: ${imgUrl}`)
      var additionalData = {
        locationId,
        imageId,
        fileName: imgUrl,
      }

      var url = '/trips/' + tripId + '/uploadImage';

      return uploadFileApi.upload(url, imgUrl, additionalData)
        .then((res) => {
          console.log('result after upload image: ' + JSON.stringify(res));
          console.log('result after upload image: ' + JSON.stringify(res.data));
          var externalStorageId: string = res.response;
          dispatch(uploadedImage(tripId, locationId, imageId, externalStorageId))
          //todo replace by stop on error
        })
        .catch((err) => {
          console.log('error after import trip: ' + JSON.stringify(err));
        });
    }
  }

  componentDidUpdate() {

    console.log("component did update");

    if (this.state.UIState == "import images") {
      console.log("component will update with import images");

      var totalImages = 0;
      var uploadedImages = 0;
      var isStartUploadImage = false;
      var locId = "";
      var imageIdToUpload: string;
      var imageUrlToUpload = "";
      _.each(this.props.trip.locations, loc => {
        _.each(loc.images, img => {
          totalImages++;
          if (img.imageId) {
            isStartUploadImage = true;
            if (img.externalStorageId) {
              uploadedImages++;
            }
            else {
              if (!imageIdToUpload) {
                locId = loc.locationId;
                imageIdToUpload = img.imageId;
                imageUrlToUpload = img.url;
              }
            }
          }
        })
      });

      if (uploadedImages == totalImages && uploadedImages > 0) {
        isStartUploadImage = false;
        console.log("now I can move to next page");
        //navigate to next page
        this.props.navigation.navigate("TripDetail", { tripId: this.state.tripId })
      }

      if (isStartUploadImage) {
        console.log(`uploading image: trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
        this.setState({ UIState: "uploading image", isLoading: true, loadingMessage: `uploading images ${uploadedImages}/${totalImages}` });
        console.log("component will update with uploading image");


        this.props.dispatch(this._uploadImage(this.state.tripId, locId, imageIdToUpload, imageUrlToUpload))
          .then(() => {
            this.setState({ UIState: "import images" });
          })
      }
      else {
        if (this.state.isLoading) {
          this.setState({ isLoading: false, loadingMessage: "" })
        }
      }
    }

  }

  render() {
    console.log("render")
    const { loadingMessage } = this.state
    return (
      <Loading message={loadingMessage} />
    );
  }
}

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch, //https://stackoverflow.com/questions/36850988/this-props-dispatch-not-a-function-react-redux
//     // importImageSelectUnselectImage,
//     // importImageSelectUnselectAllImages
//     importSelectedLocations
//   }
// };
