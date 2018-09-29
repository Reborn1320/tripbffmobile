import React from "react";

import { FlatList } from "react-native";
import { ListItem } from "native-base";
import ImportImage from "./ImportImage";
import styled from "styled-components/native";
import { ImportImageVM } from "../../../../Interfaces";

export interface Props {
    images: Array<ImportImageVM>
    handleSelect: (idx: number) => void
}

class ImportImageList extends React.Component<Props> {

    _renderItem = (itemInfo) => {
        const item: ImportImageVM = itemInfo.item
        const idx: number = itemInfo.index

        return (
            <StyledListItemImageItem noIndent
            >
                <ImportImage imageUrl={item.url} isChecked={item.isSelected} id={idx}
                    handleClick={(imageIdx) => this.props.handleSelect(imageIdx)}
                ></ImportImage>
            </StyledListItemImageItem>
            );
    }
    render() {

        const { images } = this.props;
        return (
            <StyledFlatListImageContainer
                data={images}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => String(index)}
            >
            </StyledFlatListImageContainer>
        );
    }
}

const StyledFlatListImageContainer = styled(FlatList)`
    flex-direction: row;
    flex-wrap: wrap;
    /* padding: 2px; */
    margin-top: 5px;
`

const StyledListItemImageItem = styled(ListItem)`
    border-bottom-width: 0;
    /* margin: 2px; */
    padding: 0;
`

export default ImportImageList;