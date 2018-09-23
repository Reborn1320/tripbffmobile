import React, { Component } from "react";
import { Container, Header, Content, Button, Text } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';

class TripCreation extends Component {

    constructor(props) {
        super(props);
        this.state = { chosenDate: new Date() };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    render() {

        return (
            <Container>
                <Header>
                    <Text>Create new trip</Text>
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Trip name</Label>
                            <Input />
                        </Item>
                        <Item
                            style={{ flexDirection: 'row' }}>
                            <Item last
                                style={{ flexGrow: 1 }}>
                                <Label>From</Label>
                                <DatePicker
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Date"
                                    textStyle={{ color: "orange" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    style={{ width: '50%' }}
                                />
                            </Item>
                            <Item last
                                style={{ flexGrow: 1 }}>
                                <Label>To</Label>
                                <DatePicker
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Date"
                                    textStyle={{ color: "orange" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    style={{ width: '50%' }}
                                />
                            </Item>
                        </Item>
                        <Item
                        style={{justifyContent: 'center'}}>
                            <Button
                                onPress={() => this.props.navigation.navigate("TripImportation")}
                            ><Text>Import</Text></Button>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default TripCreation;
