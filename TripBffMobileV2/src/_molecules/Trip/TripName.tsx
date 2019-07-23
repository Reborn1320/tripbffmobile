import React from "react";
import { H1 } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import NBTheme from "../../theme/variables/material.js";

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
            <H1 style={{
                fontSize: 32,
                lineHeight: 50,
                flexGrow: 9,
                maxWidth: "90%",
                color: NBTheme.brandPrimary,
            }}>{this.props.tripName}</H1>     
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