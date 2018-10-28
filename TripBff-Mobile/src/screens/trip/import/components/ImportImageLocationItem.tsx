import React from "react";
import { CheckBox, View, ListItem, Text } from "native-base";
import ImportImageList from "./ImportImageList";
import { TripImportLocationVM } from "..";

export interface Props {
    location: TripImportLocationVM
    handleSelectAll: (locationIdx: number) => void
    handleSelect: (locationIdx: number, imageIdx: number) => void

    isForceUpdate?: boolean
}

export interface State {
    locationIdx: number
}

class ImportImageLocationItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            locationIdx: props.location.id
        }
    }

    shouldComponentUpdate(nextProps: Props) {
        return nextProps.isForceUpdate;
    }
    render() {

        var location: TripImportLocationVM = this.props.location;
        var locationIdx: number = location.id;

        return (
            <ListItem noIndent
                style={{ borderBottomWidth: 0, flex: 1, padding: 0, paddingLeft: 0, paddingRight: 0 }}
            >
                <View
                    style={{ position: "absolute", right: 20, top: 10 }}
                >
                    <CheckBox checked={location.images.filter((item) => item.isSelected).length == location.images.length}
                        onPress={() => this.props.handleSelectAll(locationIdx)}
                        style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", elevation: 2 }}
                    ></CheckBox>

                </View>
                <View
                    style={{ flexDirection: "column", padding: 0 }}
                >
                    <Text
                        style={{ alignSelf: "stretch", marginTop: 5, paddingLeft: 5 }}
                        onPress={() => this.props.handleSelectAll(locationIdx)}
                    >
                        {location.location.address}
                    </Text>
                    <ImportImageList images={location.images}
                        handleSelect={(imageIdx) => this.props.handleSelect(this.state.locationIdx, imageIdx)}
                    />
                </View>
            </ListItem>
        );
    }

}

export default ImportImageLocationItem;