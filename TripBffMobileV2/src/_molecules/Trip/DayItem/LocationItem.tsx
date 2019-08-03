import React, { Component } from "react";
import { Text, Button, Icon } from "native-base";
import { TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { NavigationConstants } from "../../../screens/_shared/ScreenConstants";
import { getLabel } from "../../../../i18n";
import { StyledCarousel, IEntry } from "../../../_atoms/Carousel/StyledCarousel";
import moment from "moment";
import { mixins } from "../../../_utils"

interface IMapDispatchToProps {
    removeLocationHandler?: (dateIdx: number, locationId: string) => void
    openUpdateFeelingModalHandler?: (dateIdx: number, locationId: string) => void;
    openUpdateActivityModalHandler?: (dateIdx: number, locationId: string) => void;
}

export interface Props extends IMapDispatchToProps, PropsBase {
    tripId: string,
    dateIdx: number,
    location: StoreData.LocationVM,
}

export interface State {
    isAddFeelingModalVisible: boolean,
    isAddActivityModalVisible: boolean
}

export default class LocationItem extends Component<Props, State> {
    constructor(props) {
        super(props)

        this.state = {
            isAddFeelingModalVisible: false,
            isAddActivityModalVisible: false
        }
    }

    _openRemoveLocationModal = () => {
        this.props.removeLocationHandler(this.props.dateIdx, this.props.location.locationId)
    }

    _openUpdateFeelingModal = () => {
        this.props.openUpdateFeelingModalHandler(this.props.dateIdx, this.props.location.locationId);
    }

    _openUpdateActivityModal = () => {
        this.props.openUpdateActivityModalHandler(this.props.dateIdx, this.props.location.locationId);
    }

    _toLocationDetail = () => {
        var { tripId, dateIdx, location: { locationId } } = this.props;
        this.props.navigation.navigate(NavigationConstants.Screens.LocationDetails, { tripId, locationId, dateIdx })
    }

    render() {

        var location: StoreData.LocationVM = this.props.location;

        var feelingLabel = location.feeling && location.feeling.label ? location.feeling.label : "";
        var feelingIcon = location.feeling && location.feeling.icon ? location.feeling.icon : "smile";
        var activityLabel = location.activity && location.activity.label ? location.activity.label : getLabel("trip_detail.activity_label");
        var activityIcon = location.activity && location.activity.icon ? location.activity.icon : "running";

        let locationImages: StoreData.ImportImageVM[] = [];

        if (location.images.length == 0) {
            locationImages.push({
                imageId: "000",
                url: "",
                time: moment(),
                externalUrl: "",
                thumbnailExternalUrl: "",
                isFavorite: false,
                type: "image/jpeg"
            });
        }
        else {
            locationImages = location.images.filter(item => item.isFavorite);

            if (locationImages.length == 0) {
                locationImages = location.images.length > 3 ? location.images.slice(0, 3) : location.images;
            }
        }

        let locationImageEntries: IEntry[] = locationImages.map(img => ({
            illustration: img.thumbnailExternalUrl,
        }));

        return (
            <View style={{marginTop: 12}}>
                <View style={styles.locationNameContainer}>
                    <Icon
                        style={styles.locationName_MapIcon}
                        name="map-marker-alt" type="FontAwesome5" />
                    <TouchableOpacity style={styles.locationName_Name} onPress={this._toLocationDetail}>
                        <Text numberOfLines={2}>{location.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._openRemoveLocationModal}>
                        <Icon style={styles.locationName_CloseIcon} name="times" type="FontAwesome5" />
                    </TouchableOpacity>
                </View>

                <StyledCarousel
                    entries={locationImageEntries}
                    clickHandler={this._toLocationDetail}
                />
                <View style={styles.activityContainer}>
                    <Button
                        style={styles.activityBtn}
                        primary transparent onPress={this._openUpdateFeelingModal}>
                        <Icon name={feelingIcon} type="FontAwesome5" />
                        {
                            feelingLabel && <Text>{getLabel("trip_detail.feeling_adjective")} {feelingLabel}</Text> ||
                            <Text>{getLabel("trip_detail.feeling_label")}</Text>
                        }
                    </Button>
                    <Button
                        style={styles.activityBtn}
                        primary transparent onPress={this._openUpdateActivityModal}>
                        <Icon name={activityIcon} type="FontAwesome5" />
                        <Text>{activityLabel}</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

interface Style {
    locationNameContainer: ViewStyle;
    locationName_MapIcon: TextStyle;
    locationName_Name: TextStyle;
    locationName_CloseIcon: TextStyle;

    activityContainer: ViewStyle;
    activityBtn: TextStyle;
}

const styles = StyleSheet.create<Style>({
    locationNameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 12,
        marginRight: 16,
        marginBottom: 16
    },
    locationName_MapIcon: {
        fontSize: 16,
        paddingTop: 3
    },
    locationName_Name: {
        fontSize: 12,
        ...mixins.themes.fontNormal,
        fontStyle: "normal",
        lineHeight: 18,
        color: "#383838",
        marginLeft: 5,
        marginRight: 5,
        maxWidth: "80%",        
        flexGrow: 1
    },
    locationName_CloseIcon: {
        fontSize: 16,
        paddingTop: 3
    },
    activityContainer: {
        // ...mixins.themes.debug,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 5,
    },
    activityBtn: {
        // ...mixins.themes.debug1,
    }
});