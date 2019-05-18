import * as React from "react";
import { View, Text, Button } from "native-base";
import { StyleSheet, ViewStyle, Image, ImageStyle } from "react-native";
import RNModal from "react-native-modal";
import { connectStyle } from 'native-base';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Loading from "./Loading/Loading";

export interface Props {
  isVisible: boolean;
  confirmHandler: (selectedImages: Array<any>) => Promise<any>;
  cancelHandler?: () => void;
}

interface State {
    num: number,
    selectedImages: Array<any>,
    isUploadingImages: boolean
}

class ImagePickerModalComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);  
    this.state = {
      num: 0,
      selectedImages: [],
      isUploadingImages: false
    }
  } 

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onSave = () => {
    let { selectedImages } = this.state;   
    let totalImages = selectedImages.length;

    this.setState({
        isUploadingImages: true
    });
    
    this.props.confirmHandler(selectedImages)
    .then(numberImagesUploaded => {
        if (numberImagesUploaded == totalImages) {
           this.props.cancelHandler();
           this.setState({
                isUploadingImages: false,
                num: 0,
                selectedImages: []
            });
        }
        else {
            this.setState({
                isUploadingImages: false
            });
        }
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

    return (
        <RNModal style={styles.modal}            
            isVisible={isVisible} hideModalContentWhileAnimating>
            {this.state.isUploadingImages ? (
                <View style={[styles.modalInnerContainer, styles.loading]}>
                     <Loading message={'uploading images'} />
                </View>
            ) : (
                <View style={styles.modalInnerContainer}>
                <View style={styles.buttons}>
                        <Button transparent onPress={this._onCancel}><Text>Cancel</Text></Button>
                        <Button transparent onPress={this._onSave}><Text>Done</Text></Button>
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
