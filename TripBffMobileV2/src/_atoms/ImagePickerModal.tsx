import * as React from "react";
import { View, Text, Button } from "native-base";
import { StyleSheet, ViewStyle, Image, ImageStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Loading from "./Loading/Loading";
import { getLabel } from "../../i18n";

export interface Props {
  isVisible: boolean;
  confirmHandler: (selectedImages: Array<any>) => Promise<any>;
  cancelHandler?: () => void;
}

interface State {
    num: number,
    numUploaded: number,
    numCount: number,
    selectedImages: Array<any>,
    isUploadingImages: boolean
}

class ImagePickerModalComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);  
    this.state = {
      num: 0,
      numUploaded: 0,
      numCount: 0,
      selectedImages: [],
      isUploadingImages: false
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

  render() {
    const { isVisible } = this.props;
    const { num, numUploaded } = this.state;       

    return (
        <RNModal style={styles.modal}            
            isVisible={isVisible} hideModalContentWhileAnimating>
            {this.state.isUploadingImages ? (
                <View style={[styles.modalInnerContainer, styles.loading]}>
                     <Loading message={getLabel("location_detail.image_uploading_message")} />
                     <Text>{numUploaded + "/" + num}</Text>
                </View>
            ) : (
                <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                        <Button transparent onPress={this._onCancel}><Text>{getLabel("action.cancel")}</Text></Button>
                        <Button transparent onPress={this._onSave}><Text>{getLabel("action.add")}</Text></Button>
                    </View>
                    <View style={styles.modalContentContainer}>
                        <CameraRollPicker
                            selected={this.state.selectedImages}
                            selectedMarker={(<Icon name="check-circle" style={styles.marker} />)}
                            callback={this._pickImage} />
                    </View>     
            </View>
            )}
        </RNModal>
    );
  }
}

interface Style {
  modal: ViewStyle,
  buttons: ViewStyle;
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
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  modalContentContainer: {
    flex: 1
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

export default ImagePickerModal;
