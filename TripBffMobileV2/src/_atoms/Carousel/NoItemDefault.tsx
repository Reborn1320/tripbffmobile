
import React, { Component } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Icon } from 'native-base';

export interface Props {   
    viewContainerStyle: ViewStyle;
    titleStyle: TextStyle;
    subtitle: string;
}

export default class NoItemDefault extends Component<Props, any> {   

    render () {
        const { viewContainerStyle, titleStyle, subtitle } = this.props;

        return (
            <View style={viewContainerStyle}>
                <Icon type="FontAwesome5" name="plus" style={{ fontSize: 26, color: "lightgrey" }}/>
                <Text style={titleStyle}>
                        { subtitle }
                </Text>
            </View>
        );
    }
}
