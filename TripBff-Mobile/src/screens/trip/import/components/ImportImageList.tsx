import React from "react";

import { FlatList } from "react-native";
import { ListItem } from "native-base";
import ImportImage from "./ImportImage";
import styled from "styled-components/native";

export interface Props {
    images: Array<any>
}

class ImportImageList extends React.Component<Props> {

    renderItem(itemInfo) {
        return (
            <StyledListItem noIndent
            >
                <ImportImage imageUrl={itemInfo.item.url}></ImportImage>
            </StyledListItem>
            );
    }
    render() {

        const { images } = this.props;
        return (
            <FlatList
                data={images}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => String(index)}
                style={{flexDirection: "row", flexWrap: "wrap"}}
            >
            </FlatList>
        );
    }
}

const StyledListItem = styled(ListItem)`
    border-bottom-width: 0;
`

export default ImportImageList;