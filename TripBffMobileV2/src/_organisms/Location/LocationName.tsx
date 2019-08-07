import React from "react";
import { Text, Icon } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import { View, ViewStyle, StyleSheet, TextStyle, TouchableOpacity } from "react-native";
import { mixins } from "../../_utils";

interface IMapDispatchToProps {
    openUpdateLocationAddressModalHanlder: () => void
}


export interface Props extends IMapDispatchToProps {
    locationName: string,
    locationAddress: string
}

export interface State {
}

export default class LocationName extends React.PureComponent<Props, State> {

    _openMapLocation = () => {
        this.props.openUpdateLocationAddressModalHanlder();
    }

    render() {
        return (   
            <TouchableOpacity onPress={this._openMapLocation}>
                <View style={styles.container}>                
                    <Icon style={styles.mapIcon} name="map-marker-alt" type="FontAwesome5" />
                    <View style={styles.nameContainer}>
                        <Text numberOfLines={2} style={styles.nameText}>
                            {this.props.locationAddress}
                        </Text>
                    </View>
                    <Icon style={styles.editIcon} name="pencil-alt" type="FontAwesome5" />
                </View>
            </TouchableOpacity>         
        );
    }
}

interface Style {
    container: ViewStyle;
    mapIcon: TextStyle;
    editIcon: TextStyle;
    nameContainer: ViewStyle;
    nameText: TextStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    mapIcon: {
        fontSize: 18,
        marginRight: 10
    },
    editIcon: {
        fontSize: 18
    },
    nameContainer: {
        flexGrow: 1,
        maxWidth: "88%"
    },
    nameText: {
        //flexGrow: 1
    }
});