import React from "react";
import { Text } from "native-base";
import { connect } from "react-redux";
import _, { } from "lodash";
import { StoreData } from "../../../store/Interfaces";

export interface Props {
    likeItems: Array<StoreData.LocationLikeItemVM>
}

export interface State {
}

export default class LocationLike extends React.PureComponent<Props, State> { 

    render() {
        return (
            <Text>Things you like/dislike</Text>
            //TODO: display list of like/dislike items
        );
    }
}