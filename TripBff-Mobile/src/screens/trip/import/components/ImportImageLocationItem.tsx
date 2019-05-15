import React from "react";
import { CheckBox, View, ListItem, Text } from "native-base";
import { TripImportLocationVM , TripImportImageVM} from "../TripImportViewModels";
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../../../_molecules/ImageList/ImageList";
import { ImageSelection } from "../../../../_molecules/ImageList/ImageSelection";
import { Image } from "react-native";
import moment, { Moment } from "moment";

export interface Props {
    locationIdx: number,
    location: TripImportLocationVM
    handleSelectAll: (locationIdx: number) => void
    handleSelect: (locationIdx: number, imageIdx: number) => void

    isForceUpdate?: boolean
}

export interface State {
}

class ImportImageLocationItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
        }
    }

    shouldComponentUpdate(nextProps: Props) {
        return nextProps.isForceUpdate;
    }

    private renderItem = (itemInfo: { item: any, index: number }) => {
        const img = itemInfo.item;
        const { itemWidth } = calculateImageListWidth();

        return (
            <ImageSelection
                key={itemInfo.index}
                imageUrl={img.url}
                width={itemWidth}
                isChecked={img.data.isSelected}

                isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
                isFirstRow={ itemInfo.index < N_ITEMS_PER_ROW }

                onPress={() => this.props.handleSelect(this.props.locationIdx, itemInfo.index)}

            />
        );
    }
    
    render() {

        var location: TripImportLocationVM = this.props.location;
        var locationIdx: number = this.props.locationIdx;
        var dateOfLocation: string = moment(location.fromTime).startOf("day").format('MMM DD')
        let isLocationChecked = location.images.find((item) => item.isSelected) != null;

        return (
            <ListItem noIndent
                style={{ borderBottomWidth: 0, flex: 1, padding: 0, paddingLeft: 0, paddingRight: 0 }}
            >
                <View
                    style={{ position: "absolute", right: 20, top: 10 }}
                >
                    <CheckBox checked={isLocationChecked}
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
                        {location.name}
                    </Text>
                    <Text
                        style={{ alignSelf: "stretch", marginTop: 5, paddingLeft: 5 }}
                        onPress={() => this.props.handleSelectAll(locationIdx)}
                    >
                        {dateOfLocation + " - " + location.location.address}
                    </Text>
                    <ImageList
                        items={location.images.map(img => ({ ...img, data: img }))}
                        renderItem={this.renderItem}
                    />
                </View>
            </ListItem>
        );
    }

}

export default ImportImageLocationItem;