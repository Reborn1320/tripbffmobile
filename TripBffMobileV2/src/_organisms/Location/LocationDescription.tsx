import React from "react";
import { Dimensions, ViewStyle, StyleSheet, TextStyle, TextInput, TouchableOpacity } from 'react-native'
import { Text, View, Icon } from "native-base";
import _, { } from "lodash";
import { connectStyle } from 'native-base';
import ViewMoreText from 'react-native-view-more-text';
import { mixins } from "../../_utils";
import NBTheme from "../../theme/variables/material.js";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import { getLabel } from "../../../i18n";

export interface Props {
    description: string,
    openUpdateLocationDescriptionModalHandler: () => void
}

export interface State {
}

class LocationDescriptionComponent1 extends React.PureComponent<Props & PropsBase, State> {

    constructor(props) {
        super(props);
    }
    _openUpdateLocationDescriptionModal = () => {
        this.props.openUpdateLocationDescriptionModalHandler();
    }

    renderViewMore(onPress) {
        return (
            <Text style={styles.showMoreLessBtn} onPress={onPress}>{getLabel("location_detail:description_view_more")}</Text>
        )
    }

    renderViewLess(onPress) {
        return (
            <Text style={styles.showMoreLessBtn} onPress={onPress}>{getLabel("location_detail:description_view_less")}</Text>
        )
    }

    render() {
        const { t } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this._openUpdateLocationDescriptionModal}>
                    <View style={styles.header}>
                        <Text style={styles.nameText}>{t("location_detail:description_section_label")}</Text>
                        <Icon style={styles.editIcon} name='pencil-alt' type="FontAwesome5" />
                    </View>
                </TouchableOpacity>
                <View style={styles.textInputContainer}>
                    {
                        this.props.description
                            ?
                            (
                                <ViewMoreText                                   
                                    numberOfLines={3}
                                    renderViewMore={this.renderViewMore}
                                    renderViewLess={this.renderViewLess}
                                    textStyle={styles.textInput}
                                >
                                    <Text>
                                        {this.props.description}
                                    </Text>
                                </ViewMoreText>
                            )
                            : (
                                <Text style={styles.textInput}>
                                </Text>
                            )
                    }


                </View>
            </View>
        );
    }
}

interface Style {
    container: ViewStyle;

    header: ViewStyle;
    editIcon: TextStyle;
    nameText: TextStyle;

    textInputContainer: ViewStyle,
    textInput: TextStyle,
    showMoreLessBtn: TextStyle
}

const styles = StyleSheet.create<Style>({
    container: {
        marginBottom: 15,
    },
    header: {
        flexDirection: "row",
        marginBottom: 5,
    },
    editIcon: {
        fontSize: 18
    },
    nameText: {
        flexGrow: 1,
        color: NBTheme.brandPrimary,
        ...mixins.themes.fontBold,
    },
    textInputContainer: {
    },
    textInput: {
        color: NBTheme.colorGrey,
    },
    showMoreLessBtn: {
        color: NBTheme.brandPrimary,
    }
})

const LocationDescription =
    connectStyle<typeof LocationDescriptionComponent1>('NativeBase.Modal', styles)(LocationDescriptionComponent1);

export default withNamespaces(['location_detail'])(LocationDescription);