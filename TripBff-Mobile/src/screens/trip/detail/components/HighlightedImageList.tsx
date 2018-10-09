import React from "react";

import { View } from "react-native";
import { ListItem } from "native-base";
import HighlightedImage from "./HighlightedImage";
import styled from "styled-components/native";
import { ImageVM } from "..";

export interface Props {
    images: Array<ImageVM>
}

class HighlightedImageList extends React.Component<Props> {

    _renderItem = (itemInfo) => {
        const item: ImageVM = itemInfo.item
        const idx: number = itemInfo.index

        return (
            <StyledListItemImageItem noIndent
                key={idx}
            >
                <HighlightedImage imageUrl={item.url} id={idx}
                ></HighlightedImage>
            </StyledListItemImageItem>
        );
    }
    render() {
        console.log("render image list")
        const { images } = this.props;
        const item: ImageVM = images[0]

        return (
            <HighlightedImage imageUrl={item.url} id={0}
                ></HighlightedImage>

            // <StyledFlatListImageContainer
            // >
            //     {images.map((item, index) => this._renderItem({ item, index }))}
            // </StyledFlatListImageContainer>
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

export default HighlightedImageList;