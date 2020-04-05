import React, { Component } from "react";
import { View, Text, ViewStyle, TextStyle, Image } from "react-native";
import { Icon } from "native-base";

export interface Props {
  viewContainerStyle: ViewStyle;
  titleStyle: TextStyle;
  subtitle: string;
  canContribute: boolean;
}

export default class NoItemDefault extends Component<Props, any> {
  render() {
    const { viewContainerStyle, titleStyle, subtitle, canContribute } = this.props;
    
    return (
      <View style={viewContainerStyle}>
        { canContribute && <Image source={require("../../../assets/PlusIcon.png")} /> }
        <Text style={titleStyle}>{subtitle}</Text>
      </View>
    );
  }
}
