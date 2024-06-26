import React, { PureComponent } from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { View, Text, Icon, Button } from "native-base";
import { mixins } from "../../../_utils";
import NBColor from "../../../theme/variables/commonColor.js";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";

interface IMapDispatchToProps {
    handleCreateClick: () => void;
}

export interface Props extends IMapDispatchToProps, PropsBase { 
}

interface State {
}

export class TripsEmptyComponent extends PureComponent<Props, State> {
  constructor(props) {
      super(props);
  }
  
  render() {     
    const { t } = this.props;

    return (
        <View style={styles.container}>
            <View style={styles.firstTitleContainer}>
                <Text numberOfLines={2} style={styles.title}>
                    {t("profile:empty_trips_first_title")}
                </Text>
            </View>

            <View style={styles.othersItemContainer}>
                <Icon name="plane-departure" type="FontAwesome5" style={styles.icon}></Icon>
            </View>           

            <View style={styles.othersItemContainer}>
                <Text numberOfLines={2} style={styles.title}>
                    {t("profile:empty_trips_second_title")}
                </Text>
            </View>
            
            <View style={styles.othersItemContainer}>
                <Button bordered style={styles.button} onPress={this.props.handleCreateClick}>
                    <Text style={{...mixins.themes.fontNormal}}>
                        {t("profile:emptry_trips_button_title")}
                    </Text>
                </Button>
            </View>
        </View>
    );
  }
}

interface Style {
    container: ViewStyle;
    firstTitleContainer: ViewStyle;
    title: TextStyle;
    othersItemContainer: ViewStyle;
    icon: TextStyle;
    button: ViewStyle;
}
  
const styles = StyleSheet.create<Style>({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    firstTitleContainer: {
        maxWidth: "70%",
        marginTop: "10%"
    },
    title: {
        ...mixins.themes.fontNormal,
        fontSize: 18,
        textAlign: "center",
        color: "#383838",
        height: 50
    },
    othersItemContainer: { 
        marginTop: "10%",
        maxWidth: "70%"
    },
    icon: {
        fontSize: 54,
        color: NBColor.brandPrimary
    },
    button: {
        alignSelf: "center"
    }
})

export default withNamespaces(['profile'])(TripsEmptyComponent);