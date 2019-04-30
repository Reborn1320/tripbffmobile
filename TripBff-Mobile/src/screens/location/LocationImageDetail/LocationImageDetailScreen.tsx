import React from 'react'
import { Container, Header, Content, Button, Text } from 'native-base';
import { StoreData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import { View } from 'react-native';
import { favorLocationImage } from '../../../store/Trip/operations';

interface IMapDispatchToProps {
    favoriteLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, isFavorite: boolean) => Promise<void>
}

export interface Props {
    navigation: NavigationScreenProp<any, any>
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,
    url: string,
    isFavorite: boolean,
}

interface State {
}

class LocationImageDetail extends React.Component<Props & IMapDispatchToProps, State> {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { url, isFavorite } = this.props;
        return (
            <Container>
                <Header>
                <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
                    <Button transparent
                    >
                        <Text>BACK</Text>
                    </Button>
                    {/* <Button transparent danger
                        onPress={this.onDeleteLocationImages}
                    >
                        <Text>DELETE</Text>
                    </Button> */}
                    </View>
                </Header>
                <Content>
                    <Text>location image page</Text>
                    <Text>{url}</Text>
                    <Text>{isFavorite}</Text>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    return ownProps;
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        favoriteLocationImage: (tripId, dateIdx, locationId, imageId, isFavorite) => dispatch(favorLocationImage(tripId, dateIdx, locationId, imageId, isFavorite)),
    };
 };

const LocationImageDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationImageDetail);

export default LocationImageDetailScreen;