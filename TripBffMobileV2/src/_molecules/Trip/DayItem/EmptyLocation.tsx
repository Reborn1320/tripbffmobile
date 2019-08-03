import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import _, { } from "lodash";
import NoItemDefault from "../../../_atoms/Carousel/NoItemDefault";
import { mixins } from "../../../_utils";

interface IMapDispatchToProps {
    openAddLocationModalHandler: () => void;
}

export interface Props extends IMapDispatchToProps {
}

export interface State {
}

export default class EmptyLocationItem extends Component<Props, State> {

    render() {        

        return (
            <TouchableOpacity onPress={this.props.openAddLocationModalHandler}>
                <NoItemDefault 
                    viewContainerStyle={styles.emptyContainer}
                    titleStyle={styles.titleStyle}
                    subtitle="Click add new location"
                    >
                </NoItemDefault>
            </TouchableOpacity>
        );
    }
}

interface Style {
    emptyContainer: ViewStyle,
    titleStyle: TextStyle
}

const styles = StyleSheet.create<Style>({
    emptyContainer: {
        backgroundColor: '#F9F9F9',
        borderRadius: 6,
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 16,
        marginBottom: 16,
        height: 150,
        justifyContent: "center",
        alignItems: "center"
    },
    titleStyle: {
        marginTop: 6,
        color: '#DADADA',
        fontSize: 12,
        ...mixins.themes.fontBold,
        lineHeight: 16
    }
});