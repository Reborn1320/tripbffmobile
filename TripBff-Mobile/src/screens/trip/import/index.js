import React, { Component } from "react";
import { FlatList } from "react-native";
import { Container, Header, Content, Button, Text, Footer } from 'native-base';
import { ImportImageList } from "./components/ImportImageList";
import { ImportImageScreenData } from "./fake_data";

class TripImportationScreen extends Component {

    constructor(props) {
        super(props);
        this.props.locations = ImportImageScreenData;
    }

    renderItem = ({ item }) => (
        <ListItem noIndent
        >
            <Text
            style={{backgroundColor: orange, color: white}}

            >
                aaa
                {item.location.address}
            </Text>
            {/* <ImportImageList images={item.images} /> */}
        </ListItem>
    );

    render() {
        const { locations } = this.props;
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
