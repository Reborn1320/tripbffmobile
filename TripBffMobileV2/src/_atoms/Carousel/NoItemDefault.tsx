
import React, { Component } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Icon } from 'native-base';

export interface Props {   
    viewContainerStyle: ViewStyle;
    titleStyle: TextStyle;
    title: string;
}

export default class NoItemDefault extends Component<Props, any> {   

    render () {
        const { viewContainerStyle, titleStyle, title } = this.props;

        return (
            <View style={viewContainerStyle}>
                <Icon type="FontAwesome5" name="plus" style={{ fontSize: 40, color: "lightgrey" }}/>
                <Text style={titleStyle}>
                        { title }
                </Text>
            </View>
        );
    }
}
