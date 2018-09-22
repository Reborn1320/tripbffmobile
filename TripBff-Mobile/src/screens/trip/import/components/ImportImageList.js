import React, { Component } from "react";

import { FlatList } from "react-native";
import { Text } from "native-base";
import ImportImage from "./ImportImage";

class ImportImageList extends Component {
    
    renderItem(item) {
        <ListItem noIndent
        >
            <ImportImage imageUrl={item}></ImportImage>
        </ListItem>
    }
    render() {

        const {images } = this.props;
        return (
            <FlatList
                data={images}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => String(index)}
            >
            </FlatList>
        );
    }
}

export default ImportImageList;