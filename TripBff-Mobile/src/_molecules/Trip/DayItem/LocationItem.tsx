import React from "react";
import { Text, Card, CardItem, Left, Button, Icon, Right } from "native-base";
import { LocationVM } from '../../../_organisms/Trip/TripDetails/TripDetails';

import { TouchableHighlight, Dimensions } from "react-native";
import Location3Images from "./Location3Images";
import LocationImage from "./LocationImage";
export interface Props {
    location: LocationVM
    toLocationDetailHandler: (locationId: string) => void
    removeLocationHandler: (locationId: string) => void
}

export interface State {
    locationIdx: string
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
        const nImages = location.images.length;

        const MARGIN_LEFT = 10
        const MARGIN_RIGHT = 10
        const SIZE = Dimensions.get('window').width - MARGIN_LEFT - MARGIN_RIGHT;
        const SIZE23 = SIZE * 2 / 3

        return (
            <Card style={{ marginLeft: MARGIN_LEFT, marginRight: MARGIN_RIGHT }}
            >
                <CardItem cardBody
                    style={{ backgroundColor: "white", height: 46, paddingLeft: 10 }}
                >
                    <Text style={{ 
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 10 }}>{location.address}</Text>
                </CardItem>

                <CardItem cardBody
                    style={{ backgroundColor: "white" }}
                >
                {/* todo icon x button with confirmation modal */}

                    <TouchableHighlight
                        style={{ width: SIZE, height: SIZE23, flex: 1 }}
                        onPress={() => this.props.toLocationDetailHandler(location.id)}

                    >
                        {(nImages == 0 || nImages == 1) ? (<LocationImage images={location.images} />)
                            : (nImages == 2) ? (<LocationImage images={location.images} />) : (<Location3Images images={location.images} />)}
                    </TouchableHighlight>

                </CardItem>
                <Button rounded icon transparent danger small
                        style={{ position: "absolute", right: 0, top: 6, backgroundColor: "white" }}
                        onPress={() => this.props.removeLocationHandler(location.id)}
                        >
                        <Icon type="FontAwesome" name="times" />
                    </Button>
                <CardItem>
                    {/* todo icon x button with confirmation modal */}
                    <Left>
                        <Button transparent>
                            <Icon active type="FontAwesome" name="smile-o"/>
                            <Text>Happy</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent>
                            <Icon active type="FontAwesome" name="music"/>
                            <Text>Music</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        );
    }

}

export default LocationItem;