import React from "react";
import { TextInput, Image} from 'react-native'
import { Text, View } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";

export interface Props {
    images: Array<StoreData.ImportImageVM>
}

export interface State {
}

export default class LocationMedia extends React.PureComponent<Props, State> { 

    render() {
        return (
            <View>
                <Text>Photos & Videos</Text>
                <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                    {this.props.images.map((img, idx) => <Image key={idx} source={{ uri: img.url }} style={{width: 120, height: 120 }} ></Image>)}
                </View>
            </View>
        );
    }
}