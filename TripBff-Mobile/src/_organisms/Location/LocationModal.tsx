import React, { Component, PureComponent } from "react";
import { View } from 'native-base';
import { StoreData } from "../../store/Interfaces";
import _, { } from "lodash";
import LocationAddressModal from "./LocationAddressModal";
import LocationHighlightModal from "./LocationHighlightModal"


interface IMapDispatchToProps {
    confirmUpdateLocationAddressHandler: (name: string, address: string, long: number, lat: number) => void
    cancelUpdateLocationAddressHandler: () => void
    confirmUpdateLocationHighlightHandler: (highlights: Array<StoreData.LocationLikeItemVM>) => void
    cancelUpdateLocationHighlightHandler: () => void
}

export interface Props extends IMapDispatchToProps {
    long: number,
    lat: number,
    isUpdateLocationAddressModalVisible: boolean,
    isUpdateLocationHighlightModalVisible: boolean,
    likeItems: Array<StoreData.LocationLikeItemVM>
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
            </View>
        );
    }
}



