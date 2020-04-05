import React from "react";
import { Text, View, Icon, Badge } from "native-base";
import _ from "lodash";
import { StoreData } from "../../store/Interfaces";
import { ViewStyle, TextStyle, StyleSheet, TouchableOpacity } from "react-native";
import NBTheme from "../../theme/variables/material.js";
import { mixins } from "../../_utils";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";

export interface Props extends PropsBase {
    locale: string,
    likeItems: Array<StoreData.LocationLikeItemVM>,
    canContribute: boolean,
    openUpdateLocationHighlightModalHanlder: () => void
}

export interface State {
}

class LocationLike extends React.PureComponent<Props, State> {

    constructor(props) {
        super(props);
    }

    _openUpdateHighlightModal = () => {
        this.props.openUpdateLocationHighlightModalHanlder();
    }

    render() {
        const { t, canContribute } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    disabled={!canContribute}
                    onPress={this._openUpdateHighlightModal}
                >
                    <View style={styles.header}>
                        <Text style={styles.nameText}>{t("location_detail:like_dislike_section_label")}</Text>
                        { canContribute && <Icon style={styles.editIcon} name="pencil-alt" type="FontAwesome5" /> }
                    </View>
                </TouchableOpacity>
                {
                    this.props.likeItems ?
                        <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
                            {
                                this.props.likeItems.map(item => {
                                    var label = item["label_" + this.props.locale] 
                                        ? item["label_" + this.props.locale] : item["label_en"];

                                    if (item.highlightType == "Like")
                                        return <Badge style={styles.badge} key={item.highlightId} primary>
                                                 <Text>{label}</Text>
                                               </Badge>
                                    else { 
                                        return <Badge style={styles.badge} key={item.highlightId} danger>
                                                 <Text>{label}</Text>
                                               </Badge>                                          
                                    }                                 
                                })
                            }
                        </View>
                        : <View></View>
                }

            </View>
        );
    }
}

export default withNamespaces(['location_detail'])(LocationLike)

interface Style {
    container: ViewStyle;
    header: ViewStyle;
    editIcon: TextStyle;
    nameText: TextStyle;
    badge: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        marginBottom: 20,
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
    badge: {
        margin: 2,
        borderRadius: 5,
        height: 32,
    }
});