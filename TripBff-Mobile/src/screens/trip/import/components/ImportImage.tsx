import React from "react";
import { Thumbnail, CheckBox, View } from "native-base";
import styled from "styled-components/native";
import { TouchableHighlightComponent, TouchableHighlight } from "react-native";

export interface Props {
    imageUrl: string
    isChecked: boolean
}

export interface State {
    isChecked: boolean
}

class ImportImage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            isChecked: props.isChecked
        }
    }

    onPress() {
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    render() {
        return (
            <View
                style={{ shadowColor: "black", elevation: 5 }}
            >
                <View
                    style={{ position: "absolute", zIndex: 2, right: 5, top: 5, width: 20 + 10, elevation: 3 }}
                >
                    <CheckBox checked={this.state.isChecked}
                        style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", elevation: 1 }}
                        onPress={() => this.onPress()}
                    ></CheckBox>
                </View>
                <TouchableHighlight
                    onPress={() => this.onPress()}
                >
                    <StyledThumbnail square large
                        source={require("./redcat.jpg")}
                    />
                </TouchableHighlight>
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