import React, { Component } from "react";
import { FlatList } from "react-native";
import { Container, Header, Content, Button, Text, Footer } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';
import ImportImageList from "./components/ImportImageList";
import ImportImageScreenData from "./fake_data";

class TripImportationScreen extends Component {

    componentDidMount() {
        this.props.locations = ImportImageScreenData;
    }

    renderItem = ({ item }) => (
        <ListItem noIndent
        >
            <Text
            // style={styles.item}

            >
                {item.location.address}
            </Text>
            <ImportImageList />
        </ListItem>
    );

    render() {
        const { repos } = this.props;
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <FlatList
                        // styles={styles.container}
                        data={repos}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />
                </Content>
                <Footer>
                    <Button
                        >
                        <Text>Skip</Text>
                    </Button>

                    <Button>
                        <Text>Import</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

export default TripImportationScreen;
