import React from "react";
import { Text } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";

export interface Props {
    locationName: string,
    locationAddress: string
}

export interface State {
}

export default class LocationName extends React.PureComponent<Props, State> { 

    render() {
        return (
            <Text style={{ 
                fontSize: 26,
                fontWeight: "bold" }}>{this.props.locationName}</Text>
            //TODO: display address + map icon
        );
    }
}