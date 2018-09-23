import React from "react";
import { Thumbnail, CheckBox, View } from "native-base";
import styled from "styled-components/native";

export interface Props {
    imageUrl: string
}

class ImportImage extends React.Component<Props> {

    render() {
        return (
            <View
                style={{ shadowColor: "black", elevation: 5 }}
            >
                <View
                    style={{ position: "absolute", zIndex: 2, right: 5, top: 5, width: 20 + 10, elevation: 3 }}
                >
                    <CheckBox checked
                        style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", elevation: 1 }}

                    ></CheckBox>
                </View>
                <StyledThumbnail square large
                    source={require("./redcat.jpg")}
                />
            </View>
        );
    }

}

export default ImportImage;

const StyledThumbnail = styled(Thumbnail)`
    z-index: 1;
    /* box-shadow: 10px 5px 5px black; */
    border-color: black;
    border-width: 1px;
`