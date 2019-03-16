import React, { Component } from "react";
import { Spinner, View, H1 } from 'native-base';
import { FlatList } from "react-native";
import _, { } from "lodash";
import DayItem from "../../../_molecules/Trip/DayItem/DayItem";
import * as RNa from "react-navigation";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import moment from "moment";
import AddLocationModal from "./AddLocationModal";
import AddFeelingModal from "./AddFeelingModal";
import { StoreData } from "../../../store/Interfaces";
import AddActivityModal from "./AddActivityModal";

interface IMapDispatchToProps {
    removeLocation: (tripId: string, locationId: string) => Promise<void>
    addLocation: (address: string, fromTime: moment.Moment) => Promise<void>
    updateLocationFeeling: (locationId: string, feeling: StoreData.FeelingVM) => Promise<void>
    updateLocationActivity: (locationId: string, activity: StoreData.ActivityVM) => Promise<void>
}

export interface Props extends IMapDispatchToProps {
    navigation: RNa.NavigationScreenProp<any, any>;
    tripId: string,
    days: DayVM[],
    isLoaded: boolean,
    tripName: string
}

interface State {
    modalVisible: boolean,
    isConfirmationModalVisible: boolean,
    focusingLocationId?: string,
    isAddLocationModalVisible: boolean,
    selectedDate: moment.Moment
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean
}

export interface DayVM {
    idx: number,
    date?: moment.Moment,
    locations: LocationVM[]
}

export interface LocationVM {
    id: string
    address: string
    images: Array<ImageVM>,
    feeling?: FeelingVM,
    activity?: ActivityVM
}

export interface ImageVM {
    url: string
    highlight: boolean
}

export interface FeelingVM {
    feelingId: number,
    label: string,
    icon: string
}

export interface ActivityVM {
    activityId: number,
    label: string,
    icon: string
}

export class TripDetails extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            modalVisible: false,
            isConfirmationModalVisible: false,
            isAddLocationModalVisible: false,
            selectedDate: null,
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false
        }
    }

    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (

            <DayItem
                locations={day.locations} dayIdx={day.idx} date={day.date}
                toLocationDetailHandler={(locationId) => {
                    this.props.navigation.navigate("LocationDetail", { tripId: this.props.tripId, locationId })
                }}
                removeLocationHandler={(locationId) => this.removeLocation(locationId)}
                addLocationHandler={(dayIdx, date) => this.addLocationModal(dayIdx, date)}
                addFeelingModalHandler={(locationId) => this.openAddFeelingModal(locationId)}
                addActivityModalHandler={(locationId) => this.openAddActivityModal(locationId)}
            />
        )
    };

    removeLocation(locationId) {
        console.log("removeLocation")
        this.setState({
            isConfirmationModalVisible: true,
            focusingLocationId: locationId,
        })
    }

    _removeLocationConfirmed = () => {
        let focusingLocationId = this.state.focusingLocationId;
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        });

        this.props.removeLocation(this.props.tripId, focusingLocationId);
    }

    _cancelModal = () => {
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    addLocationModal(dayIdx, date) {
        this.setState({
            isAddLocationModalVisible: true,
            selectedDate: date
        })  
    }

    _addLocationConfirmed = (address, fromTime)  => {
        this.setState({
            isAddLocationModalVisible: false
        });
        
        this.props.addLocation(address, fromTime);
    }

    _cancelAddLocationModal = () => {
        this.setState({
            isAddLocationModalVisible: false
        }) 
    }

    openAddFeelingModal(locationId) {
        this.setState({
            isAddFeelingModalVisible: true,
            focusingLocationId: locationId
        });
    }

    _updateFeelingConfirmed = (locationId, feeling) => {
        this.setState({
            isAddFeelingModalVisible: false
        });
        this.props.updateLocationFeeling(locationId, feeling);
    }

    _cancelAddfeelingModal = () => {
        this.setState({
            isAddFeelingModalVisible: false
        }) 
    }

    openAddActivityModal(locationId) {
        this.setState({
            isAddActivityModalVisible: true,
            focusingLocationId: locationId
        });
    }

    _updateActivityConfirmed = (locationId, activity) => {
        this.setState({
            isAddActivityModalVisible: false
        });
        this.props.updateLocationActivity(locationId, activity);
    }

    _cancelAddActivityModal = () => {
        this.setState({
            isAddActivityModalVisible: false
        }) 
    }

    render() {
        const { isConfirmationModalVisible, 
                isAddLocationModalVisible, 
                selectedDate,
                isAddFeelingModalVisible,
                focusingLocationId,
                isAddActivityModalVisible } = this.state;
        const { tripName, days, isLoaded } = this.props;
        return (
            <View>
                <H1 style={{ fontSize: 40, lineHeight: 70, marginBottom: 20, marginLeft: 20 } }>{tripName}</H1>
                {!isLoaded && <Spinner color='green' />}
                {isLoaded &&
                    <FlatList
                        // styles={styles.container}
                        data={days}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />}
                <ConfirmationModal title="DELETE LOCATION" content="Do you want to delete this location ?"
                    confirmHandler={this._removeLocationConfirmed}
                    cancelHandler={this._cancelModal}
                    isVisible={isConfirmationModalVisible} />
                 <AddLocationModal
                    isVisible={isAddLocationModalVisible} 
                    date={selectedDate}
                    confirmHandler={this._addLocationConfirmed}
                    cancelHandler={this._cancelAddLocationModal}/>
                 <AddFeelingModal
                    isVisible={isAddFeelingModalVisible}
                    locationId={focusingLocationId}                    
                    confirmHandler={this._updateFeelingConfirmed}
                    cancelHandler={this._cancelAddfeelingModal}/>
                 <AddActivityModal
                    isVisible={isAddActivityModalVisible}
                    locationId={focusingLocationId}                    
                    confirmHandler={this._updateActivityConfirmed}
                    cancelHandler={this._cancelAddActivityModal}/>
            </View>
        );
    }
}

