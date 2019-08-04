import { TabBar } from "react-native-tab-view";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { mixins } from "../_utils";
import NBColor from "../theme/variables/commonColor.js";

class TabBarComponent extends React.Component<any, any> {
    render() {
        return (
            <TabBar
                {...this.props.tabProps}
                indicatorStyle={{ backgroundColor: NBColor.brandPrimary }}
                style={styles.tabBar}
                renderLabel={({ route, focused, color }) => (
                <Text style={styles.tabBarItemLabel}>
                    {route.title}
                </Text>
                )}
            />
        )
    }
}

export default TabBarComponent;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        height: 48
    },
    tabBarItemLabel: {  
        color: NBColor.brandPrimary,
        textTransform: "capitalize",
        fontSize: 16,
        ...mixins.themes.fontNormal
    }
  });


