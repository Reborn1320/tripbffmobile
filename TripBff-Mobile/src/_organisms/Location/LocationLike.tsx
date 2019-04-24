import React from "react";
import { Text, View, Icon, Button } from "native-base";
import _, { } from "lodash";
import { StoreData } from "../../store/Interfaces";
import { Badge } from "react-native-elements"

export interface Props {
    likeItems: Array<StoreData.LocationLikeItemVM>,
    openUpdateLocationHighlightModalHanlder: () => void
}

export interface State {
}

export default class LocationLike extends React.PureComponent<Props, State> { 

    _openUpdateHighlightModal = () => {
        this.props.openUpdateLocationHighlightModalHanlder();
    }

    render() {
        return (
            <View>
                <Button transparent
                    onPress={this._openUpdateHighlightModal}>
                    <Icon name="thumbs-up" type="FontAwesome5" />
                    <Text>Things you like/dislike</Text>
                </Button>

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