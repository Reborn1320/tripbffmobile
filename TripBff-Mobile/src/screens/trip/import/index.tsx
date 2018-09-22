import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer, ListItem } from 'native-base';
import ImportImageList from "./components/ImportImageList";
import ImportImageScreenData from "./fake_data";

export interface Props {
    // locations: Array<any> //TODO
}

interface State {
    locations: Array<any> //TODO
}
class TripImportationScreen extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            locations: ImportImageScreenData
        }
    }

    renderItem = ({ item }) => (
        <ListItem noIndent
        >
            <View
                style={{flexDirection: "column"}}
            >
                <Text
                    style={{ }}
                >
                    {item.location.address}
                </Text>
                <ImportImageList images={item.images} />
            </View>
        </ListItem>
    );

    render() {
        const { locations } = this.state
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <FlatList
                        // styles={styles.container}
                        data={locations}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />
                </Content>
                <Footer>
                    <Button transparent success
                    >
                        <Text>Skip</Text>
                    </Button>

                    <Button transparent success
                    >
                        <Text>Import</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

export default TripImportationScreen;
