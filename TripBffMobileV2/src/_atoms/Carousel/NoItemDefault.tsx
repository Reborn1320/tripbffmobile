
import React, { Component } from 'react';
import { View, Text, ViewStyle, TextStyle, Image } from 'react-native';
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
                <Image                               
                    source={require('../../../assets/PlusIcon.png')}
                />
                <Text style={titleStyle}>
                        { subtitle }
                </Text>
            </View>
        );
    }
}
