import React from "react";

import { View } from "react-native";
import { ListItem } from "native-base";
import ImportImage from "./ImportImage";
import styled from "styled-components/native";
import { TripImportImageVM } from "../TripImportViewModels";

export interface Props {
    images: Array<TripImportImageVM>
    handleSelect: (idx: number) => void
}

class ImportImageList extends React.Component<Props> {

    _renderItem = (itemInfo) => {
        const item: TripImportImageVM = itemInfo.item
        const idx: number = itemInfo.index

        return (
            <StyledListItemImageItem noIndent
                key={idx}
            >
                <ImportImage imageUrl={item.url} isChecked={item.isSelected} id={idx}
                    handleClick={(imageIdx) => this.props.handleSelect(imageIdx)}
                ></ImportImage>
            </StyledListItemImageItem>
        );
    }
    render() {
        console.log("render image list")
        const { images } = this.props;
        return (
            <StyledFlatListImageContainer
            // data={images}
            // renderItem={this._renderItem}
            // keyExtractor={(item, index) => String(index)}
            >
                {images.map((item, index) => this._renderItem({ item, index }))}
            </StyledFlatListImageContainer>
        );
    }
}

const StyledFlatListImageContainer = styled(View)`
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