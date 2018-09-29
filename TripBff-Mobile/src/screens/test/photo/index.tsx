import React, { Component } from 'react'
import { View, Button, Container, Header, Content, Text } from 'native-base';
import { ScrollView, Image } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import loadPhotosWithinAsync from '../../shared/photo/PhotosLoader';
import moment from "moment";
import checkAndRequestPhotoPermissionAsync from '../../shared/photo/PhotoPermission';
import { PhotoMetaData } from '../../shared/photo/PhotoInterface';

export interface Props {
    navigation: NavigationScreenProp<any, any>
}

interface State {
    photos: PhotoMetaData[]
    photoPermission?: boolean
}

export default class PhotoScreen extends Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            photos: []
        }
    }

    componentDidMount() {
        checkAndRequestPhotoPermissionAsync()
        .then((value) => {
            console.log("request photo permission completed")
            this.setState({ photoPermission: true })
        })
    }

    //https://facebook.github.io/react-native/docs/cameraroll#getphotos
    _handleButtonPress = () => {
        loadPhotosWithinAsync(moment("2018-09-27").unix(), moment("2018-09-29").add(1, "day").unix())
        .then((photos) => {
            console.log(`photos result = ${photos.length} photos`)
            this.setState({ photos: photos });
        })
    };

    render() {
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <View>
                        <Button onPress={this._handleButtonPress} ><Text>Load Images</Text></Button>
                        <ScrollView>
                            {this.state.photos.map((p, i) => {
                                return (
                                    <Image
                                        key={i}
                                        style={{
                                            width: 80,
                                            height: 80,
                                        }}
                                        source={{ uri: p.image.uri }}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>
                </Content>
            </Container>


        )
    }
}
