import React, { Component } from "react";
import { Container, Header, Content, View, Text } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import { PropsBase } from "../../_shared/LayoutContainer";
import * as RNa from "react-navigation";
import TripDetailsContainer2 from "../../../_organisms/Trip/TripDetails/TripDetailsContainer";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

interface IMapDispatchToProps {
    addInfographicId: (tripId: string, infographicId: string) => void
}

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM,
    navigation: RNa.NavigationScreenProp<any, any>;
}

interface State {
}

export class TripEditScreen extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { trip, navigation } = this.props;
        return (
            <Container>
                <Header>
                    <View style={{ height: 100, flex: 1, paddingTop: 10 }}>
                        {/* <Button
                            style={{ marginLeft: 'auto' }}
                            onPress={() => this.confirmExportInfographic()}>
                            <Text style={{ paddingTop: 15 }}>Done</Text>
                        </Button> */}
                        <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                            <MenuTrigger text='Select option' />
                            <MenuOptions>
                                <MenuOption value={1} text='One' />
                                <MenuOption value={2}>
                                    <Text style={{ color: 'red' }}>Two</Text>
                                </MenuOption>
                                <MenuOption value={3} disabled={true} text='Three' />
                            </MenuOptions>
                        </Menu>
                    </View>

                </Header>
                <Content>
                    <TripDetailsContainer2 trip={trip} navigation={navigation} />
                </Content>
            </Container>
        );
    }
}

