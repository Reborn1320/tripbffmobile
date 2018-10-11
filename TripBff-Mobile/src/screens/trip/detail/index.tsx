import React, { Component } from "react";
import { Container, Header, Content } from 'native-base';
import { NavigationScreenProp } from "react-navigation";
import { FlatList } from "react-native";
import { StoreData } from "../../../Interfaces";
import { connect } from "react-redux";
import _, { } from "lodash";
import moment from "moment";
import DayItem from "./components/DayItem";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    trip: StoreData.TripVM
}

interface State {
    tripId: number
    fromDate: moment.Moment
    toDate: moment.Moment
    name: string
    days: DayVM[]
}

export interface DayVM {
    idx: number
    locations: LocationVM[]
}

export interface LocationVM {
    id: number
    address: string
    images: Array<ImageVM>
}

export interface ImageVM {
    url: string
    highlight: boolean
}

class TripDetail extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        var dayVMs: DayVM[] = []
        const nDays = props.trip.toDate.diff(props.trip.fromDate, "days") + 1

        for (let idx = 0; idx < nDays; idx++) {
            dayVMs.push({
                idx: idx,
                locations: props.trip.locations
                    .filter(element => element.fromTime.diff(props.trip.fromDate, "days") == idx)
                    .map(e => {
                        return {
                            id: e.locationId,
                            address: e.location.address,
                            images: e.images.map(img => { return { url: img.url, highlight: false } })
                        }
                    })

            })
        }

        this.state = {
            tripId: props.trip.id,
            fromDate: props.trip.fromDate,
            toDate: props.trip.toDate,
            name: props.trip.name,
            days: dayVMs
        }
    }

    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (

            <DayItem
                locations={day.locations} dayIdx={day.idx}
                toLocationDetailHandler={(locationId) => {
                    this.props.navigation.navigate("LocationDetail", { tripId: this.state.tripId, locationId })}}
            />
        )
    };

render() {
    const { days } = this.state
    return (
        <Container>
            <Header>
            </Header>
            <Content>
                <FlatList
                    // styles={styles.container}
                    data={days}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => String(index)}
                />
            </Content>
        </Container>
    );
}
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId } = ownProps.navigation.state.params
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        trip
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
    // importImageSelectUnselectImage,
    // importImageSelectUnselectAllImages
    // importSelectedLocations
};

const TripDetailScreen = connect(mapStateToProps, mapDispatchToProps)(TripDetail);

export default TripDetailScreen;

