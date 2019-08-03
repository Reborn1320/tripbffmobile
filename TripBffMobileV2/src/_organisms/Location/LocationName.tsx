import React from "react";
import { Text, Icon } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import { View, ViewStyle, StyleSheet, TextStyle } from "react-native";
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
            <View style={styles.container}>
                <Icon style={styles.mapIcon} name="map-marker-alt" type="FontAwesome5" />
                <Text style={styles.nameText} onPress={this._openMapLocation}>
                    {this.props.locationAddress}
                </Text>
                <Icon style={styles.editIcon} name="pencil-alt" type="FontAwesome5" />
            </View>
        );
    }
}

interface Style {
    container: ViewStyle;
    mapIcon: TextStyle;
    editIcon: TextStyle;
    nameText: TextStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "stretch",
    },
    mapIcon: {
        fontSize: 18,
        marginRight: 10
    },
    editIcon: {
        fontSize: 18
    },
    nameText: {
        flexGrow: 1
    }
});