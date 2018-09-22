import React from "react";
import { Icon, Text, Card, CardItem, Content, Body, Thumbnail, CheckBox, View } from "native-base";

export interface Props {
    imageUrl: string
}

class ImportImage extends React.Component<Props> {

    render() {
        const { imageUrl } = this.props;
        return (
            <View style={{ }}>
                <View
                    style={{ position: "absolute", zIndex: 2, right: 5, top: 5, width: 20 + 10 }}
                >
                    <CheckBox checked 
                        style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", shadowRadius: 5 }}

                    ></CheckBox>
                </View>
                <Thumbnail square large
                    source={require("./redcat.jpg")}
                    style={{ zIndex: 1 }}
                />
            </View>
        );
    }

}

export default ImportImage;