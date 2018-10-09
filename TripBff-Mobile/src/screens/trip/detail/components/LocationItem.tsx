import React from "react";
import { CheckBox, View, ListItem, Text } from "native-base";
import HighlightedImageList from "./HighlightedImageList";
import { LocationVM } from "..";

export interface Props {
    location: LocationVM
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
        var locationIdx: number = location.id;

        return (
            <ListItem noIndent
                style={{ borderBottomWidth: 0, flex: 1, padding: 0, paddingLeft: 0, paddingRight: 0 }}
            >
                <View
                    style={{ flexDirection: "column", padding: 0 }}
                >
                    <Text
                        style={{ alignSelf: "stretch", marginTop: 5, paddingLeft: 5 }}
                    >
                        {location.address}
                    </Text>
                    <HighlightedImageList images={location.images}
                    />
                </View>
            </ListItem>
        );
    }

}

export default LocationItem;