import React from "react";
import { H1 } from "native-base";
import { Text } from "react-native";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import NBTheme from "../../theme/variables/material.js";
import { mixins } from "../../_utils";

export interface Props {
    tripName: string
}

export interface State {
}

class TripNameComponent extends React.Component<Props, State> { 

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props.tripName != nextProps.tripName;
    }

    render() {
        return (
            <Text 
                numberOfLines={2}
                style={{
                    fontSize: 20,
                    lineHeight: 26,
                    ...mixins.themes.fontExtraBold,
                    fontStyle: "normal",                  
                    color: NBTheme.brandPrimary,
                }}>{this.props.tripName}
            </Text>     
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
    var { tripId } = ownProps;
    return {
        tripName: storeState.currentTrip.name
    };
};

const TripName = connect(
    mapStateToProps,
    null
)(TripNameComponent);

export default TripName;