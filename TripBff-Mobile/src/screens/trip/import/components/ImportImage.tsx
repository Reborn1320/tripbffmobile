import React from "react";
import { Icon, Text, Card, CardItem, Content, Body, View } from "native-base";

export interface Props {
    imageUrl: string
}

class ImportImage extends React.Component<Props> {

    render() {
        const { imageUrl } = this.props;
        return (
            <View style={{ flexDirection: "row"}}>
                <Icon type="FontAwesome" name="home" />
                <Text>{imageUrl}</Text>
            </View>
        );
    }

}

export default ImportImage;