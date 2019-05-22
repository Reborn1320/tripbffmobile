import React from "react";
import { H1 } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";

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
                fontSize: 40,
                lineHeight: 50,
                flexGrow: 9,
                maxWidth: "90%",
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