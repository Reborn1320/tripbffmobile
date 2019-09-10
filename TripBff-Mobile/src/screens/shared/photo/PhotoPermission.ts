import * as Expo from "expo"
import { Alert } from "react-native";

//https://github.com/yonahforst/react-native-permissions
export default function checkAndRequestPhotoPermissionAsync() {

    var promise = new Promise<any>((resolveFunc, rejectFunc) => {

        Expo.Permissions.getAsync(Expo.Permissions.CAMERA_ROLL)
            .then(({ status }) => {
                if (status != "granted") {
                    _requestPermission(resolveFunc, rejectFunc)
                }
                else {
                    resolveFunc(0)
                }
            })
    });


    return promise
}

// Request permission to access photos
function _requestPermission(resolveFunc: (value: any) => void, rejectFunc: (reason?: any) => void) {
    Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL)
        .then(({ status }) => {
            if (status == "granted") {
                resolveFunc(0);

                // this.setState({ photoPermission: true })
            }
            else {
                rejectFunc("User deny permission")
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
function _alertForPhotosPermission() {
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