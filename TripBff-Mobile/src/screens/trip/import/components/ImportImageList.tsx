import React from "react";

import { FlatList } from "react-native";
import { ListItem } from "native-base";
import ImportImage from "./ImportImage";
import styled from "styled-components/native";
import { ImportImageVM } from "../../../../Interfaces";

export interface Props {
    images: Array<ImportImageVM>
}

class ImportImageList extends React.Component<Props> {

    renderItem(itemInfo) {
        const item: ImportImageVM = itemInfo.item;

        return (
            <StyledListItemImageItem noIndent
            >
                <ImportImage imageUrl={item.url} isChecked={item.isSelected}></ImportImage>
            </StyledListItemImageItem>
            );
    }
    render() {

        const { images } = this.props;
        return (
            <StyledFlatListImageContainer
                data={images}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => String(index)}
            >
            </StyledFlatListImageContainer>
        );
    }
}

const StyledFlatListImageContainer = styled(FlatList)`
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2px;
    margin-top: 5px;
`

const StyledListItemImageItem = styled(ListItem)`
    border-bottom-width: 0;
    margin: 2px;
    padding: 0;
`

export default ImportImageList;