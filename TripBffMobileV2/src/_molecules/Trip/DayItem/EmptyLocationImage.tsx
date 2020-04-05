import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import _, { } from "lodash";
import NoItemDefault from "../../../_atoms/Carousel/NoItemDefault";
import { mixins } from "../../../_utils";

interface IMapDispatchToProps {
    action: () => void;
}

export interface Props extends IMapDispatchToProps {
    viewContainerStyle: ViewStyle;
    subTitle: string;
    canContribute: boolean;
}

export interface State {
}

export default class EmptyLocationImageItem extends Component<Props, State> {

    render() {        
        const { canContribute } = this.props;

        return (
            <TouchableOpacity
                onPress={this.props.action}>
                <NoItemDefault 
                    canContribute={canContribute}
                    viewContainerStyle={this.props.viewContainerStyle}
                    titleStyle={styles.titleStyle}
                    subtitle={this.props.subTitle}
                    >
                </NoItemDefault>
            </TouchableOpacity>             
        );
    }
}

interface Style {
    titleStyle: TextStyle
}

const styles = StyleSheet.create<Style>({
    titleStyle: {
        marginTop: 6,
        color: '#DADADA',
        fontSize: 12,
        ...mixins.themes.fontBold,
        lineHeight: 16
    }
});