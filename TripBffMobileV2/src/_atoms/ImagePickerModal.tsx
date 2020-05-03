import * as React from "react";
import { View, Text } from "native-base";
import { StyleSheet, ViewStyle, Dimensions, ActivityIndicator, SafeAreaView } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import Loading from "./Loading/Loading";
import StyledCameraRollPicker from "./CameraRollPicker/StyledCameraRollPicker";
import Footer2Buttons from "./Footer2Buttons";
import { mixins } from "../_utils";
import { PropsBase } from "../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import Flurry from 'react-native-flurry-sdk';

export interface Props extends PropsBase {
  isVisible: boolean;
  confirmHandler: (selectedImages: Array<any>) => Promise<any>;
  cancelHandler?: () => void;
}

interface State {
  num: number,
  numUploaded: number,
  numCount: number,
  selectedImages: Array<any>,
  isUploadingImages: boolean,
  containerWidth: number;
  isLoading: boolean
}

class ImagePickerModalComponent extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    let { width } = Dimensions.get('window');
    this.state = {
      num: 0,
      numUploaded: 0,
      numCount: 0,
      selectedImages: [],
      isUploadingImages: false,
      containerWidth: width - 10 * 2,
      isLoading: true
    }
  }

  componentDidUpdate() {
    let { selectedImages, num, numUploaded, numCount, isUploadingImages } = this.state;

    if (isUploadingImages) {
      if (num > numCount) {
        let selectedImage = selectedImages[numCount];

        this.props.confirmHandler([selectedImage])
          .then(numberImagesUploaded => {
            this.setState({
              numCount: numCount + 1,
              numUploaded: numUploaded + numberImagesUploaded
            });
          });
      }
      else {
        this.setState({
          num: 0,
          numUploaded: 0,
          numCount: 0,
          selectedImages: [],
          isUploadingImages: false
        });
        this.props.cancelHandler();
      }
    }
  }

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onSave = () => {
    Flurry.logEvent('Location Details - Uploaded Image');
    
    this.setState({
      isUploadingImages: true
    });
  }

  private _pickImage = (images) => {
    var num = images.length;

    this.setState({
      num: num,
      selectedImages: images
    });
  }

  _onModalShow = () => {
    Flurry.logEvent('Location Details - Upload Images');
    
    this.setState({
      isLoading: false
    })
  }

  _onModalHide = () => {
    this.setState({
      isLoading: true
    })
  }

  render() {
    const { isVisible, t } = this.props;
    const { num, numUploaded, isLoading, isUploadingImages } = this.state;

    var loadingElement = isLoading 
          ? <ActivityIndicator size="small" color="#00ff00" />
          :   <SafeAreaView style={styles.modalInnerContainer}>
                <View style={styles.modalContentContainer}>
                  <StyledCameraRollPicker
                    containerWidth={this.state.containerWidth}
                    selected={this.state.selectedImages}
                    callback={this._pickImage} />
                </View>
                <Footer2Buttons
                  onCancel={this._onCancel}
                  onAction={this._onSave}
                  cancelText="action:cancel"
                  actionText="action:add"
                  primary
                />
              </SafeAreaView>;
    var contentElement = isUploadingImages ? (
                <SafeAreaView style={[styles.modalInnerContainer, styles.loading]}>
                  <Loading message={t("location_detail:image_uploading_message")} />
                  <Text>{numUploaded + "/" + num}</Text>
                </SafeAreaView>
              ) : loadingElement;

    return (
      <RNModal style={styles.modal}
        onBackButtonPress={this._onCancel}
        onModalShow={this._onModalShow}
        onModalHide={this._onModalHide}
        isVisible={isVisible} hideModalContentWhileAnimating>
        {contentElement}
      </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  modalInnerContainer: ViewStyle;
  modalContentContainer: ViewStyle;
  marker: any;
  loading: ViewStyle
}

const styles = StyleSheet.create<Style>({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  modalContentContainer: {
    flex: 1,
    ...mixins.centering,
  },
  marker: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
    fontSize: 25,
    height: 27,
    color: "green"
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  }
})

const ImagePickerModal =
  connectStyle<typeof ImagePickerModalComponent>('NativeBase.Modal', styles)(ImagePickerModalComponent);

export default withNamespaces(['location_detail'])(ImagePickerModal);
