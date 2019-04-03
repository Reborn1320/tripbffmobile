import React from "react";
import { TextInput } from 'react-native'
import { Text, View } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";

export interface Props {
    description: string
}

export interface State {
}

export default class LocationDescription extends React.PureComponent<Props, State> { 

    render() {
        return (
            <View>
                <Text>Description</Text>
                <TextInput
                    placeholder = "What are your feeling?"
                    multiline = {true}
                    numberOfLines = {4}
                    editable = {true}
                    maxLength = {80}
                    style={{ fontSize: 18, marginBottom: 20, maxHeight: 200 }}
                />
            </View>
        );
    }
}