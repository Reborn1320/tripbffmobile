import React from "react";
import { Thumbnail, View } from "native-base";
import styled from "styled-components/native";

export interface Props {
    id: number
    imageUrl: string
}

export interface State {
}

class HighlightedImage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View
                style={{ shadowColor: "black", elevation: 5 }}
            >
                <StyledThumbnail square large
                    style={{ width: 120, height: 120 }} //TODO: use screen dimension to scale differently :D
                    source={{ uri: this.props.imageUrl }}
                />
            </View>
        );
    }

}

export default HighlightedImage;

const StyledThumbnail = styled(Thumbnail)`
    z-index: 1;
    /* box-shadow: 10px 5px 5px black; */
    /* border-color: black;
    border-width: 1px; */
`