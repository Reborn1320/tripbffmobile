import React, { Component, PureComponent } from "react";
import { View } from 'native-base';
import { StoreData } from "../../store/Interfaces";
import _, { } from "lodash";
import LocationAddressModal from "./LocationAddressModal";
import LocationHighlightModal from "./LocationHighlightModal";
import UpdateLocationDescriptionModal from "./LocationDescriptionModal";
import ImagePickerModal from "../../_atoms/ImagePickerModal";

interface IMapDispatchToProps {
    confirmUpdateLocationAddressHandler: (name: string, address: string, long: number, lat: number) => void
    cancelUpdateLocationAddressHandler: () => void
    confirmUpdateLocationHighlightHandler: (highlights: Array<StoreData.LocationLikeItemVM>) => void
    cancelUpdateLocationHighlightHandler: () => void
    confirmUpdateLocationDescriptionHandler: (description: string) => void
    cancelUpdateLocationDescriptionHandler: () => void
    confirmAddImageHandler: (images: Array<any>) => Promise<any>
    cancelAddImageHandler: () => void
}

export interface Props extends IMapDispatchToProps {
    long: number,
    lat: number,
    isUpdateLocationAddressModalVisible: boolean,
    isUpdateLocationHighlightModalVisible: boolean,
    isUpdateLocationDescriptionModalVisible: boolean,
    isOpenImagePickerModalVisible: boolean,
    likeItems: Array<StoreData.LocationLikeItemVM>,
    description: string
}

interface State {
}

export default class LocationModal extends PureComponent<Props, State> { 

    _updateLocationAddressConfirmed = (name, address, long, lat) => {
        this.props.confirmUpdateLocationAddressHandler(name, address, long, lat);
    }

    _cancelUpdateLocationAddress = () => {
        this.props.cancelUpdateLocationAddressHandler();
    }    

    _updateLocationHighlightConfirmed = (highlights) => {
        this.props.confirmUpdateLocationHighlightHandler(highlights);
    }

    _cancelUpdateLocationHighlight = () => {
        this.props.cancelUpdateLocationHighlightHandler();
    }    

    _updateLocationDescriptionConfirmed = (description) => {
        this.props.confirmUpdateLocationDescriptionHandler(description);
    }

    _cancelUpdateLocationDescription = () => {
        this.props.cancelUpdateLocationDescriptionHandler();
    }  

    _confirmAddImageHandler = (images: Array<any>) => {
        return this.props.confirmAddImageHandler(images);
    }

    _cancelAddImage = () => {
        this.props.cancelAddImageHandler();
    }

    render() {
        return (
            <View>
                <LocationAddressModal
                    long={this.props.long}
                    lat={this.props.lat}
                    confirmHandler={this._updateLocationAddressConfirmed}
                    cancelHandler={this._cancelUpdateLocationAddress}
                    isVisible={this.props.isUpdateLocationAddressModalVisible}
                />              
                <LocationHighlightModal
                    confirmHandler={this._updateLocationHighlightConfirmed}
                    cancelHandler={this._cancelUpdateLocationHighlight}
                    isVisible={this.props.isUpdateLocationHighlightModalVisible}
                    likeItems={this.props.likeItems}>
                </LocationHighlightModal>
                <UpdateLocationDescriptionModal
                    confirmHandler={this._updateLocationDescriptionConfirmed}
                    cancelHandler={this._cancelUpdateLocationDescription}
                    isVisible={this.props.isUpdateLocationDescriptionModalVisible}
                    description={this.props.description}>                    
                </UpdateLocationDescriptionModal>
                <ImagePickerModal
                     confirmHandler={this._confirmAddImageHandler}
                     cancelHandler={this._cancelAddImage}
                     isVisible={this.props.isOpenImagePickerModalVisible}
                    >
                </ImagePickerModal>
            </View>
        );
    }
}



