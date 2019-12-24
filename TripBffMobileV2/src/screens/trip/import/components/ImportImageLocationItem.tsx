import React from "react";
import { CheckBox, View, ListItem, Text, Icon } from "native-base";
import { TripImportLocationVM, TripImportImageVM } from "../TripImportViewModels";
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../../../_molecules/ImageList/ImageList";
import { ImageSelection } from "../../../../_molecules/ImageList/ImageSelection";
import { Image, ViewStyle, TextStyle, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import 'moment/locale/vi';
import NBTheme from "../../../../theme/variables/material.js";
import { PropsBase } from "../../../_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";

export interface Props extends PropsBase {
    locationIdx: number,
    location: TripImportLocationVM
    handleSelectAll: (locationIdx: number) => void
    handleSelect: (locationIdx: number, imageIdx: number) => void

    isForceUpdate?: boolean

    handleOpenOtherSuggestionsModal: (location: TripImportLocationVM) => void
}

export interface State {
}

class ImportImageLocationItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
        }
    }

    shouldComponentUpdate(nextProps: Props) {
        return nextProps.isForceUpdate;
    }

    private _openOtherSuggestionsModal = () => {
        this.props.handleOpenOtherSuggestionsModal(this.props.location);
    }

    private renderItem = (itemInfo: { item: any, index: number }) => {
        const img = itemInfo.item;
        const { itemWidth } = calculateImageListWidth(10, 10);

        return (
            <ImageSelection
                key={itemInfo.index}
                imageUrl={img.url}
                width={itemWidth}
                isChecked={img.data.isSelected}

                isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
                isFirstRow={itemInfo.index < N_ITEMS_PER_ROW}

                onPress={() => this.props.handleSelect(this.props.locationIdx, itemInfo.index)}

            />
        );
    }    

    render() {
        var { t } = this.props;
        var location: TripImportLocationVM = this.props.location;
        var locationIdx: number = this.props.locationIdx;
        var dateOfLocation: string = t("common:dateFormat", { date: location.fromTime.startOf("day") });
        let isLocationChecked = location.images.find((item) => item.isSelected) != null;

        return (
            <View style={styles.container}>
                <View style={styles.locationContainer} >
                    <TouchableOpacity onPress={() => this.props.handleSelectAll(locationIdx)}>
                        <View style={styles.checkbox}>                           
                            {isLocationChecked == false &&
                            <Icon style={styles.uncheckIcon} active type="FontAwesome5" name="circle" />
                            }
                            {isLocationChecked == true &&
                            <Icon style={styles.checkIcon} active solid type="FontAwesome5" name="check-circle" />
                            }
                        </View>
                    </TouchableOpacity>                    
                    <Text
                        numberOfLines={2}
                        style={Object.assign({ maxWidth: Dimensions.get("window").width - 135}, styles.locationName)}
                        onPress={() => this.props.handleSelectAll(locationIdx)}
                    >
                        {location.name}
                    </Text>
                    <Text
                        style={styles.date}
                        onPress={() => this.props.handleSelectAll(locationIdx)}
                    >
                        {dateOfLocation}
                    </Text>
                </View>
                <View style={styles.locationAddressContainer}>
                    <Text
                        style={styles.locationAddress}
                        onPress={() => this.props.handleSelectAll(locationIdx)}
                    >
                        {location.location.address}
                    </Text>
                </View>
                {
                    location.nearerLocations.length > 0 &&
                    <View style={styles.otherSuggestionsContainer}>
                        <TouchableOpacity onPress={this._openOtherSuggestionsModal}>
                            <Text style={styles.otherSuggestionsLabel}>View other suggestions</Text>
                        </TouchableOpacity>                    
                    </View>
                }
               
                <ImageList
                    items={location.images.map(img => ({ ...img, data: img }))}
                    renderItem={this.renderItem}
                    paddingLeftRight={10}
                />
            </View>
        );
    }

}

export default withNamespaces(["common"])(ImportImageLocationItem);

interface Style {
    container: ViewStyle;
    locationContainer: ViewStyle;
    locationAddressContainer: ViewStyle;
    checkbox: ViewStyle;
    uncheckIcon: TextStyle;
    checkIcon: TextStyle;
    locationName: TextStyle;
    date: TextStyle;
    locationAddress: TextStyle;
    otherSuggestionsContainer: ViewStyle;
    otherSuggestionsLabel: TextStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        marginTop: 10,
    },
    locationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        marginLeft: 10,
        marginRight: 10,
        // ...mixins.themes.debug1,
    },
    locationAddressContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        marginBottom: 3,
    },
    checkbox: {
        // ...mixins.themes.debug,
    },
    uncheckIcon: {
        color: NBTheme.brandPrimary,
        width: 25,
        height: 25,
        fontSize: 23,
        flexGrow: 1,
    },
    checkIcon: {
        color: NBTheme.brandPrimary,
        width: 25,
        height: 25,
        fontSize: 23,
        // flexGrow: 1,
    },
    locationName: {
        color: NBTheme.brandPrimary,
        flexGrow: 1,
        marginLeft: 5,
        fontSize: 18,

        // ...mixins.themes.debug,
    },
    date: {
        fontSize: 14,
        paddingTop: 3,
        alignSelf: "flex-start",
    },
    locationAddress: {
        fontSize: 14,
    },
    otherSuggestionsContainer: {
        marginLeft: 10,
        marginRight: 10,        
        marginBottom: 7,
    },
    otherSuggestionsLabel: {
        color: NBTheme.brandPrimary,        
        fontSize: 13
    }
})
