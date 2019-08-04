import React, { Component } from "react";
import { Text, Button, Icon } from "native-base";
import { TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle, Dimensions } from "react-native";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { NavigationConstants } from "../../../screens/_shared/ScreenConstants";
import { getLabel } from "../../../../i18n";
import { StyledCarousel, IEntry } from "../../../_atoms/Carousel/StyledCarousel";
import moment from "moment";
import { mixins } from "../../../_utils";
import NBColor from "../../../theme/variables/material.js";
import EmptyLocationItem from "../../Trip/DayItem/EmptyLocation";

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
        let locationImageEntries: IEntry[] = [];

        if (location.images.length > 0) {
            locationImages = location.images.filter(item => item.isFavorite);

            if (locationImages.length == 0) {
                locationImages = location.images.length > 3 ? location.images.slice(0, 3) : location.images;
            }

            locationImageEntries = locationImages.map(img => ({
                illustration: img.thumbnailExternalUrl,
            }));
        } 

        return (
            <View style={styles.locationContainer}>
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

                {
                    locationImageEntries.length > 0 &&              
                     <StyledCarousel
                        entries={locationImageEntries}
                        clickHandler={this._toLocationDetail}
                    /> 
                }
                {
                    locationImageEntries.length == 0 &&
                    <EmptyLocationItem
                        viewContainerStyle={styles.emptyImageContainer}
                        subTitle={getLabel("message.add_image")}
                        openAddLocationModalHandler={this._toLocationDetail}
                        >
                    </EmptyLocationItem>
                }
                  <View style={styles.activityContainer}>
                    <TouchableOpacity
                        style={styles.feelingBtn}
                        onPress={this._openUpdateFeelingModal}>
                        <Icon name={feelingIcon} type="FontAwesome5" style={styles.activityIcon}/>
                        {
                            feelingLabel && <Text style={styles.activityContent} numberOfLines={2}>{getLabel("trip_detail.feeling_adjective")} {feelingLabel}</Text> ||
                            <Text numberOfLines={2} style={styles.activityContent}>{getLabel("trip_detail.feeling_label")}</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.activityBtn}
                        onPress={this._openUpdateActivityModal}>
                        <Icon name={activityIcon} type="FontAwesome5" style={styles.activityIcon}/>
                        <Text numberOfLines={2} style={styles.activityContent}>{activityLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

interface Style {
    locationContainer: ViewStyle;
    locationNameContainer: ViewStyle;
    locationName_MapIcon: TextStyle;
    locationName_Name: TextStyle;
    locationName_CloseIcon: TextStyle;

    activityContainer: ViewStyle;
    activityBtn: ViewStyle;
    feelingBtn: ViewStyle;
    activityIcon: TextStyle;
    activityContent: TextStyle;

    emptyImageContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    locationContainer: {
        marginTop: 16
    },
    locationNameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 12,
        marginRight: 16,
        marginBottom: 16
    },
    locationName_MapIcon: {
        fontSize: 16,
        paddingTop: 4
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
        justifyContent: "space-evenly",
        marginTop: 10,
        marginBottom: 5,
        width: "90%"
    },
    activityBtn: {
        maxWidth: "45%",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: "7%"
    },
    feelingBtn: {
        maxWidth: "45%",
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    activityIcon: {
        marginLeft: 5,
        fontSize: 22,
        paddingTop: 1
    },
    activityContent: {
        ...mixins.themes.fontBold,
        fontSize: 14,
        lineHeight: 20,
        fontStyle: "normal",
        color: NBColor.brandPrimary,
        marginLeft: 10
    },
    emptyImageContainer: {
        backgroundColor: '#F9F9F9',
        borderRadius: 6,
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        height: 184,
        justifyContent: "center",
        alignItems: "center"
    }   
});