import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer, ListItem, CheckBox, Card } from 'native-base';
import ImportImageList from "./components/ImportImageList";
import ImportImageScreenData from "./fake_data";
import styled from "styled-components/native";

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
        <StyledListItem noIndent
        >
            <View
                style={{ position: "absolute", right: 10, top: 10 }}
            >
                <CheckBox checked
                    style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", shadowRadius: 5 }}
                ></CheckBox>

            </View>
            <View
                style={{ flexDirection: "column" }}
            >
                <Text
                    style={{ alignSelf: "stretch" }}
                >
                    {item.location.address}
                </Text>
                <ImportImageList images={item.images} />
            </View>
        </StyledListItem>
    );

    render() {
        const { locations } = this.state
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <StyledFlatList
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

const StyledFlatList = styled(FlatList)`
  border-bottom-width: 0;
`

const StyledListItem = styled(ListItem)`
  border-bottom-width: 0;
  border-color: red;
  border-width: 1;

  flex: 1;
`

export default TripImportationScreen;
