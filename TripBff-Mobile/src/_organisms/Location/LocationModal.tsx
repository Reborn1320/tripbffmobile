import React, { Component, PureComponent } from "react";
import { View } from 'native-base';
import { StoreData } from "../../store/Interfaces";
import _, { } from "lodash";
import LocationAddressModal from "./LocationAddressModal";
import moment from 'moment';


interface IMapDispatchToProps {
    confirmUpdateLocationAddressHandler: (name: string, address: string, long: number, lat: number) => void
    cancelUpdateLocationAddressHandler: () => void
}

export interface Props extends IMapDispatchToProps {
    long: number,
    lat: number,
    isUpdateLocationAddressModalVisible: boolean
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
            </View>
        );
    }
}



