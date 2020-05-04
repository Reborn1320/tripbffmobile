import React from 'react'
import { Text, Icon } from 'native-base';
import _ from "lodash";
import { View, TouchableOpacity, ViewStyle, StyleSheet, TextStyle, SafeAreaView } from 'react-native';
import Gallery from 'react-native-image-gallery';
import DeviceInfo from "react-native-device-info";
import { PropsBase } from '../../../screens/_shared/LayoutContainer';
import Flurry from 'react-native-flurry-sdk';

interface Props extends PropsBase {  
}

interface State {
   index: number,
   isToogled: boolean,
   hasNotch: boolean,
   images: Array<any>
}

class TripInfograhicImage extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            isToogled: true,
            images: [{ source: { uri: this.props.navigation.getParam('photoUri') }}],
            hasNotch: false
        }
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        DeviceInfo.hasNotch().then(hasNotch => {
            this.setState({hasNotch: hasNotch});
        });
        Flurry.logEvent('View Infographic');
    }   

    private _onCancel = () => {
        this.props.navigation.goBack();
    }        

    private _onToggle = () => {
        this.setState({isToogled: !this.state.isToogled});
    }

    galleryCount() {
        const { index, images, hasNotch } = this.state;
        let notchStyle = hasNotch ? styles.topNotch : styles.topWithoutNotch;

        return (
            <View style={[styles.headerActionContainer, notchStyle]}>
                 <TouchableOpacity onPress={this._onCancel} style={styles.backButtonContainer}>
                    <Icon type="Ionicons" name="close" style={styles.iconStyle}></Icon>
                </TouchableOpacity> 
                <Text style={styles.galleryCount}>{ index + 1 } / { images.length }</Text>
            </View>
        );
    }    

    render() {
        let { isToogled, images, index } = this.state;

        return (
            <SafeAreaView style={styles.imageContainer}>
                <Gallery
                    flatListProps={{showsHorizontalScrollIndicator: false}}
                    style={styles.galleryContainer}
                    initialPage={index}
                    onSingleTapConfirmed={this._onToggle}
                    images={images}
                />
                {
                    isToogled &&
                    this.galleryCount()
                }                    
            </SafeAreaView>
            
        )
    }
}

export default TripInfograhicImage

interface Style {
    imageContainer: ViewStyle;
    galleryContainer: ViewStyle;
    headerActionContainer: ViewStyle;
    backButtonContainer: TextStyle;
    iconStyle: TextStyle;
    galleryCount: TextStyle;
    favoriteButton: TextStyle;
    topWithoutNotch: ViewStyle;
    topNotch: ViewStyle;
  }
  
  const styles = StyleSheet.create<Style>({
    imageContainer: {
        flex: 1  
    }, 
    galleryContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    headerActionContainer: {    
        height: 40,
        backgroundColor: 'transparent',
        width: '100%',
        flexDirection: "row",
        position: 'absolute',
        justifyContent: 'space-between',
        paddingTop: "2%"
    },
    backButtonContainer: {
        textAlign: 'left',
        paddingLeft: "5%"
    },
    iconStyle: {
        color: "white"
    },
    galleryCount: {
        textAlign: 'right',
        color: 'white',
        fontSize: 16,
        fontStyle: 'italic',
        paddingRight: '5%',
        paddingTop: "2%"
    },        
    favoriteButton: {
        textAlign: 'left',
        paddingLeft: "10%",
        paddingTop: "3%"
    },
    topWithoutNotch: {
        top: 40
    },
    topNotch: {
        top: 40
    }
  })