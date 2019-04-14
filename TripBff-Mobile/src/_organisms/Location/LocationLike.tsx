import React from "react";
import { Text, View } from "native-base";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import { Badge } from "react-native-elements"

export interface Props {
    likeItems: Array<StoreData.LocationLikeItemVM>
}

export interface State {
}

export default class LocationLike extends React.PureComponent<Props, State> { 
    render() {
        return (
            <View>
                <Text>Things you like/dislike</Text>
                <View style={{flexDirection: "row", flexWrap: 'wrap'}}>
                    {
                        this.props.likeItems.map(item => 
                            (item.type == "Like" 
                                ? <Badge key={item.likeItemId} value={item.label} status="primary"/> 
                                : <Badge key={item.likeItemId} value={item.label} status="warning"/>
                            ))
                    }
                </View>                
            </View>
        );
    }
}