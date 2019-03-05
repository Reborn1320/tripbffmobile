import React, { Component } from "react";
import { Spinner, View, H1, Icon } from 'native-base';
import { FlatList } from "react-native";
import _, { } from "lodash";
import DayItem from "../../../_molecules/Trip/DayItem/DayItem";
import * as RNa from "react-navigation";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import { mixins } from "../../../_utils";
import EditPopupMenu from "../../../_molecules/Trip/EditPopupMenu/EditPopupMenu";
import { Modal } from "../../../_atoms";
import { TripDateRangeForm } from "./TripDateRangeForm";

interface IMapDispatchToProps {
    removeLocation: (tripId: string, locationId: string) => Promise<void>
}

export interface Props extends IMapDispatchToProps {
    navigation: RNa.NavigationScreenProp<any, any>;
    tripId: string,
    days: DayVM[],
    isLoaded: boolean,
    tripName: string,
    fromDate: Moment,
    toDate: Moment,
}

interface State {
    modalVisible: boolean,
    isConfirmationModalVisible: boolean,
    focusingLocationId?: string,
}

export interface DayVM {
    idx: number
    locations: LocationVM[]
}

export interface LocationVM {
    id: string
    address: string
    images: Array<ImageVM>
}

export interface ImageVM {
    url: string
    highlight: boolean
}

export class TripDetails extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            modalVisible: false,
            isConfirmationModalVisible: false,
        }
    }

    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (

            <DayItem
                locations={day.locations} dayIdx={day.idx}
                toLocationDetailHandler={(locationId) => {
                    this.props.navigation.navigate("LocationDetail", { tripId: this.props.tripId, locationId })
                }}
                removeLocationHandler={(locationId) => this.removeLocation(locationId)}
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

    render() {
        const { isConfirmationModalVisible } = this.state;
        const { tripName, days, isLoaded } = this.props;
        return (
            <View>
                <View style={{
                    // ...mixins.themes.debug1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    marginBottom: 10,
                }}>
                    <H1 style={{
                        // ...mixins.themes.debug2,
                        fontSize: 40,
                        lineHeight: 50,
                        flexGrow: 9,
                        maxWidth: "90%",
                    }}>{tripName}</H1>
                    <EditPopupMenu onSelect={} />
                </View>

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

                <Modal isVisible={isEditDateRangeModalVisible} >
                        <TripDateRangeForm fromDate={fromDate} toDate={toDate} onClickEdit={this.onEdit} />
                    </Modal>
            </View>
        );
    }
}

