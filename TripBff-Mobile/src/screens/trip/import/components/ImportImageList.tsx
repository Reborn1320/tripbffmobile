import React from "react";

import { FlatList } from "react-native";
import { ListItem } from "native-base";
import ImportImage from "./ImportImage";

export interface Props {
    images: Array<any>
}

class ImportImageList extends React.Component<Props> {

    renderItem(itemInfo) {
        return (
            
            <ListItem noIndent
            >
                <ImportImage imageUrl={itemInfo.item.url}></ImportImage>
            </ListItem>
            );
    }
    render() {

        const { images } = this.props;
        return (
            <FlatList
                data={images}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => String(index)}
                style={{flexDirection: "row"}}
            >
            </FlatList>
        );
    }
}

export default ImportImageList;