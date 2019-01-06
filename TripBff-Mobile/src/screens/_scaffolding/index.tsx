import React, { Component } from "react";
import { Container, Header, Content, Spinner, Text } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment from "moment";
import { PropsBase } from "../_shared/LayoutContainer";
import { StoreData } from "../../Interfaces";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps, PropsBase {
}

interface State {
    // tripId: number
    isLoaded: boolean;
}

class TripDetail extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        
        this.state = {
            isLoaded: false
        }
    }

render() {
    const { isLoaded } = this.state
    return (
        <Container>
            <Header>
            </Header>
            <Content>
                {!isLoaded && <Spinner color='green' />}
               {isLoaded && 
                    <Text>page content here</Text>} 
            </Content>
        </Container>
    );
}
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    // const { tripId } = ownProps.navigation.state.params
    // var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        // trip
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
};

const TripDetailScreen = connect(mapStateToProps, mapDispatchToProps)(TripDetail);

export default TripDetailScreen;

