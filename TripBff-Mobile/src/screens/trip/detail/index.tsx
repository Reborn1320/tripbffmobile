import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View, CheckBox, ListItem } from 'native-base';
import ImportImageList from "./components/ImportImageList";
import styled from "styled-components";
import { NavigationScreenProp } from "react-navigation";
import { FlatList } from "react-native";

export interface Props {
    navigation: NavigationScreenProp<any, any>
    locations: Array<any> //TODO
}

interface State {
}

class TripDetail extends Component<Props, State> {

    renderItem = ({ item }) => (
        <StyledListItem noIndent
        >
            <View
                style={{ flexDirection: "column", padding: 0, }}
            >
                <Text
                    style={{ alignSelf: "stretch", marginTop: 5, }}
                >
                    {item.location.address}
                </Text>
                <ImportImageList images={item.images} />
            </View>
        </StyledListItem>
    );

    render() {
        const { locations } = this.props.navigation.state.params
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
            </Container>
        );
    }
}

export default TripDetail;

const StyledFlatList = styled(FlatList)`
  border-bottom-width: 0;
`

const StyledListItem = styled(ListItem)`
  border-bottom-width: 0;

  flex: 1;
  padding: 0;
`
