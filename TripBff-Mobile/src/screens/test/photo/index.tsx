import React, { Component } from 'react'
import { View, Button, Container, Header, Content, Text } from 'native-base';
import { ScrollView, Image, CameraRoll, Alert } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import * as Expo from "expo"
import loadPhotosWithinAsync from './PhotosLoader';
import moment from "moment";

export interface Props {
    navigation: NavigationScreenProp<any, any>
}

interface State {
    //copy from react-native type definition
    // photos: {
    //     node: {
    //         type: string;
    //         group_name: string;
    //         image: {
    //             uri: string;
    //             height: number;
    //             width: number;
    //             isStored?: boolean;
    //         };
    //         timestamp: number;
    //         location: {
    //             latitude: number;
    //             longitude: number;
    //             altitude: number;
    //             heading: number;
    //             speed: number;
    //         };
    //     };
    // }[],
    photos: string[]
    photoPermission?: boolean
}

export default class PhotoScreen extends Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            photos: []
        }
    }

    //https://github.com/yonahforst/react-native-permissions
    componentDidMount() {
        //TODO: use async
        Expo.Permissions.getAsync(Expo.Permissions.CAMERA_ROLL)
            .then(({ status }) => {
                if (status != "granted") {
                    this._requestPermission()
                }
            })
    }

    // Request permission to access photos
    _requestPermission = () => {
        Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL)
            .then(({ status }) => {
                if (status == "granted") {
                    this.setState({ photoPermission: true })
                }
                console.log(`Expo.Permissions ${status}`)
            });
    }

    // This is a common pattern when asking for permissions.
    // iOS only gives you once chance to show the permission dialog,
    // after which the user needs to manually enable them from settings.
    // The idea here is to explain why we need access and determine if
    // the user will say no, so that we don't blow our one chance.
    // If the user already denied access, we can ask them to enable it from settings.
    _alertForPhotosPermission() {
        Alert.alert(
            'Can we access your photos?',
            'We need access so you can set your profile pic',
            [
                {
                    text: 'No way',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                this.state.photoPermission
                    ? { text: 'OK', onPress: this._requestPermission }
                    : { text: 'Open Settings', onPress: () => Expo.Linking.openURL('app-settings:') },
            ],
        )
    }

    //https://facebook.github.io/react-native/docs/cameraroll#getphotos
    _handleButtonPress = () => {
        loadPhotosWithinAsync(moment("2018-09-27").unix(), moment("2018-09-29").add(1, "day").unix())
        .then((photos) => {
            console.log(`photos result = ${photos.length} photos`)
            this.setState({ photos: photos });
        })
        // CameraRoll.getPhotos({
        //     first: 20,
        //     assetType: 'Photos',
        // })
        // .then(r => {
        //     this.setState({ photos: r.edges });
        // })
        // .catch((err) => {
        //     //Error Loading Images
        // });
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
                                        source={{ uri: p }}
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
