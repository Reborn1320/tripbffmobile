import React from "react";
import { CheckBox, View, ListItem, Text } from "native-base";
import { TripImportLocationVM , TripImportImageVM} from "../TripImportViewModels";
import ImageList, { calculateImageListWidth } from "../../../../_molecules/ImageList/ImageList";
import { ImageSelection } from "../../../../_molecules/ImageList/ImageSelection";

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
                imageUrl={img.url}
                width={itemWidth}
                isChecked={img.data.isSelected}
            />
        );
    }
    
    render() {

        var location: TripImportLocationVM = this.props.location;
        var locationIdx: number = this.props.locationIdx;

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
                    <ImageList
                        items={location.images.map(img => ({ ...img, data: img }))}
                        renderItem={this.renderItem}

                        onSelect={(imageIdx, imageIndex) => this.props.handleSelect(this.props.locationIdx, imageIndex)}
                    />
                </View>
            </ListItem>
        );
    }

}

export default ImportImageLocationItem;