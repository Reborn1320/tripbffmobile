import React, { Component } from "react";
import { Container, Header, Content, Spinner, Button, Text , View} from 'native-base';
import { FlatList, Alert } from "react-native";
import { StoreData } from "../../../Interfaces";
import { connect } from "react-redux";
import _, { } from "lodash";
import moment from "moment";
import DayItem from "./components/DayItem";
import { tripApi } from "../../_services/apis";
import { PropsBase } from "../../_shared/LayoutContainer";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import * as RNa from "react-navigation";
import { addInfographicId } from '../../trip/export/actions';

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
}

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
    tripId: string
    fromDate: moment.Moment
    toDate: moment.Moment
    name: string
    days: DayVM[],
    isLoaded: boolean,
    modalVisible: boolean
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
            isLoaded: false,
            modalVisible: false,
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
                             idx: idx + 1,
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
    
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    exportInfographic() {
        // call api to request export infographic
        var tripId = this.props.trip.id;
        tripApi
        .post('/trips/' + tripId + '/infographics')
        .then(res => {
            var infographicId = res.data;
            // store infogphicId into store
            this.props.addInfographicId(tripId, infographicId);
            console.log('infographic id: ' + infographicId);
            this.props.navigation.navigate(NavigationConstants.Screens.TripsInfographicPreivew, {tripId: tripId});
        })
        .catch(error => {
            console.log("error: " + JSON.stringify(error));
        });
    }

    confirmExportInfographic() {
        Alert.alert(
            'Confirm',
            'Export infographic ?',
            [
              {text: 'Cancel', onPress: () => this.props.navigation.navigate(NavigationConstants.Screens.TripsList), style: 'cancel'},
              {text: 'OK', onPress: () => this.exportInfographic()},
            ],
            { cancelable: false }
          )
    }

render() {
    const { days, isLoaded } = this.state
    return (
        <Container>
            <Header>
                <View style={{ height: 100, flex: 1, paddingTop: 10 }}> 
                    <Button
                        style={{ marginLeft: 'auto' }}
                        onPress={() => this.confirmExportInfographic()}>
                        <Text style={{ paddingTop: 15 }}>Done</Text>
                    </Button>   
                </View>
                 
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
    addInfographicId
};

const TripDetailScreen = connect(mapStateToProps, mapDispatchToProps)(TripDetail);

export default TripDetailScreen;

