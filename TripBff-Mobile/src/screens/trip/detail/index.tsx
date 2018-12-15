import React, { Component } from "react";
import { Container, Header, Content, Spinner } from 'native-base';
import { FlatList } from "react-native";
import { StoreData } from "../../../Interfaces";
import { connect } from "react-redux";
import _, { } from "lodash";
import moment from "moment";
import DayItem from "./components/DayItem";
import { tripApi } from "../../_services/apis";
import { BaseProps } from "../../_shared/LayoutContainer";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps, BaseProps {
    trip: StoreData.TripVM
}

interface State {
    tripId: number
    fromDate: moment.Moment
    toDate: moment.Moment
    name: string
    days: DayVM[],
    isLoaded: boolean
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

        this.state = {
            tripId: props.trip.id,
            fromDate: props.trip.fromDate,
            toDate: props.trip.toDate,
            name: props.trip.name,
            days: dayVMs,
            isLoaded: false
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

    async componentDidMount() {
         // get locations of trip from server
         var url = '/trips/' + this.props.trip.id +'/locations';
         tripApi.get(url)
                 .then((res) => {
                     var trip = res.data;
                     var dayVMs: DayVM[] = [];
                     //console.log('after get trip: ' + JSON.stringify(trip));

                     const nDays = this.state.toDate.diff(this.state.fromDate, "days") + 1                      
 
                     for (let idx = 0; idx < nDays; idx++) {
                         dayVMs.push({
                             idx: idx,
                             locations: trip.locations
                                 .filter(element => moment(element.fromTime).diff(this.state.fromDate, "days") == idx)
                                 .map(e => {
                                     return {
                                         id: e.locationId,
                                         address: e.location.address,
                                         images: e.images.map(img => { return { url: img.url, highlight: false } })
                                     }
                                 })
             
                         })
                     }
                     
                     //console.log('dayVMs: ' + JSON.stringify(dayVMs));    
                     this.setState({ days: dayVMs, isLoaded: true });
 
                 })
                 .catch((err) => {
                     console.log('error: ' + JSON.stringify(err));
                 }); 
    }

render() {
    const { days, isLoaded } = this.state
    return (
        <Container>
            <Header>
            </Header>
            <Content>
                {!isLoaded && <Spinner color='green' />}
               {isLoaded && 
                    <FlatList
                    // styles={styles.container}
                    data={days}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => String(index)}
                />} 
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

