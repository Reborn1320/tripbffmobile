import React from "react";
import { Text, Card, CardItem, Left, Thumbnail, Body, Button, Icon, Right } from "native-base";
import { LocationVM } from "..";

import { Image, TouchableHighlight } from "react-native";
export interface Props {
    location: LocationVM
    toLocationDetailHandler: (locationId: number) => void
}

export interface State {
    locationIdx: number
}

class LocationItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            locationIdx: props.location.id
        }
    }

    render() {

        var location: LocationVM = this.props.location;
        const firstImage = location.images[0].url;
        return (
            <Card style={{ marginLeft: 10, marginRight: 10 }}
            >
                <CardItem cardBody
                >
                    <TouchableHighlight
                        style={{ height: 200, width: null, flex: 1 }}
                        onPress={() => this.props.toLocationDetailHandler(location.id) }

                    >

                        <Image source={{ uri: firstImage }} style={{ height: 200, width: null, flex: 1 }}

                        />
                    </TouchableHighlight>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon active name="thumbs-up" />
                            <Text>12 Likes</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Button transparent>
                            <Icon active name="chatbubbles" />
                            <Text>4 cm(s)</Text>
                        </Button>
                    </Body>
                    <Right>
                        <Text>11h ago</Text>
                    </Right>
                </CardItem>
            </Card>
        );
    }

}

export default LocationItem;