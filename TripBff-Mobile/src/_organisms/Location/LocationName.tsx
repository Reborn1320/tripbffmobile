import React from "react";
import { Text, Icon } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import { View } from "react-native";

interface IMapDispatchToProps {
    openUpdateLocationAddressModalHanlder: () => void
}


export interface Props extends IMapDispatchToProps {
    locationName: string,
    locationAddress: string
}

export interface State {
}

export default class LocationName extends React.PureComponent<Props, State> { 

    _openMapLocation = () => {
        this.props.openUpdateLocationAddressModalHanlder();
    }

    render() {
        return (
            <View>
                <View>
                    <Text style={{ 
                        fontSize: 26,
                        fontWeight: "bold" }}>{this.props.locationName}
                    </Text>
                </View>
                <View>
                    <Text onPress={this._openMapLocation}>
                        {this.props.locationAddress}
                        <Icon name="globe" type="FontAwesome5"/>   
                    </Text>
                </View>                 
            </View>
        );
    }
}