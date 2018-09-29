import React from "react";
import { Thumbnail, CheckBox, View } from "native-base";
import styled from "styled-components/native";
import { TouchableHighlight } from "react-native";

export interface Props {
    id: number
    imageUrl: string
    isChecked: boolean
    handleClick: (imageIdx: number) => void
}

export interface State {
}

class ImportImage extends React.Component<Props, State> {

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
                <View
                    style={{ position: "absolute", zIndex: 2, right: 5, top: 5, width: 20 + 10, elevation: 3 }}
                >
                    <CheckBox checked={this.props.isChecked}
                        style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", elevation: 1 }}
                        onPress={() => this.props.handleClick(this.props.id)}
                    ></CheckBox>
                </View>
                <TouchableHighlight
                    onPress={() => this.props.handleClick(this.props.id)}
                >
                    <StyledThumbnail square large
                        source={{ uri: this.props.imageUrl }}
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
    /* border-color: black;
    border-width: 1px; */
`