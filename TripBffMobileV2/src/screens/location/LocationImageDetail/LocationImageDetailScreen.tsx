import React from 'react'
import { Text, Icon } from 'native-base';
import { StoreData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import { View, TouchableOpacity, ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { favorLocationImage } from '../../../store/Trip/operations';
import Gallery from 'react-native-image-gallery';

interface IMapDispatchToProps {
    favoriteLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, isFavorite: boolean) => Promise<void>
}

export interface Props {
    navigation: NavigationScreenProp<any, any>
    tripId: string,
    dateIdx: number,
    locationId: string,
    imageId: string,
    isFavorite: boolean,
    images: Array<StoreData.ImportImageVM>
}

interface State {
    isToogled: boolean,
    index: number,
    images: Array<any>,
    currentImage: StoreData.ImportImageVM
}

class LocationImageDetail extends React.Component<Props & IMapDispatchToProps, State> {

    constructor(props) {
        super(props);

        this.state = {
            isToogled: true,
            index: this.props.images.findIndex(item => item.imageId == this.props.imageId),
            currentImage: this.props.images.find(item => item.imageId == this.props.imageId),
            images: this.props.images.map(img => {
                return {
                    source: { uri: img.externalUrl }
                }
            })
        }
    }

    static navigationOptions = {
        header: null
    };

    private _onFavorite = () => {
        var { currentImage } = this.state;

        this.props.favoriteLocationImage(this.props.tripId,
            this.props.dateIdx,
            this.props.locationId,
            currentImage.imageId,
            !currentImage.isFavorite);
        currentImage.isFavorite = !currentImage.isFavorite;
        this.setState({
            currentImage: currentImage
        });
    }

    private _onCancel = () => {
        this.props.navigation.goBack();
    }    

    private _onChangeImage = (index) => {
        var currentImage = this.props.images[index];
        this.setState({ index, currentImage: currentImage });
    }

    private _onToggle = () => {
        this.setState({isToogled: !this.state.isToogled});
    }

    galleryCount() {
        const { index, images } = this.state;

        return (
            <View style={styles.headerActionContainer}>
                 <TouchableOpacity onPress={this._onCancel} style={styles.backButtonContainer}>
                    <Icon type="Ionicons" name="close" style={styles.iconStyle}></Icon>
                </TouchableOpacity> 
                <Text style={styles.galleryCount}>{ index + 1 } / { images.length }</Text>
            </View>
        );
    }

    setFavorite() {
        var { currentImage } = this.state;
        return (
            <View style={styles.footerContainer}>
                <View style={styles.footerActionContainer}>
                    <TouchableOpacity onPress={this._onFavorite} style={styles.favoriteButton}>
                        {
                            currentImage.isFavorite &&
                            <Icon type="FontAwesome5" name="heart" active solid 
                                style={[styles.favoriteIcon, styles.activeFavoriteIcon]}>
                            </Icon> ||
                            <Icon type="FontAwesome5" name="heart" style={[styles.iconStyle, styles.favoriteIcon]}>
                            </Icon>
                        }                        
                    </TouchableOpacity>
                    <Text style={styles.favoriteLabel}>{"Love"}</Text>
                </View>
            </View>
        )
    }

    render() {
        let { isToogled, images, index } = this.state;

        return (
            <View style={styles.imageContainer}>
                    <Gallery
                        flatListProps={{showsHorizontalScrollIndicator: false}}
                        style={styles.galleryContainer}
                        initialPage={index}
                        onPageSelected={this._onChangeImage}
                        onSingleTapConfirmed={this._onToggle}
                        images={images}
                    />
                    {
                        isToogled &&
                        this.galleryCount()
                    }
                    {
                        isToogled &&
                        this.setFavorite()
                    }
            </View>
            
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId, dateIdx, locationId, imageId, isFavorite } = ownProps.navigation.state.params;
    var trip = storeState.currentTrip;
    var images = Array<StoreData.ImportImageVM>();

    if (trip) {
        var dateVM = trip.dates.find(date => date.dateIdx == dateIdx);

        if (dateVM) {
            var location = dateVM.locations.find(item => item.locationId == locationId);
            images = location ? location.images : images;
        }        
    }

    return {
        tripId, dateIdx, 
        locationId, imageId,
        isFavorite,
        images: images
    };
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        favoriteLocationImage: (tripId, dateIdx, locationId, imageId, isFavorite) => dispatch(favorLocationImage(tripId, dateIdx, locationId, imageId, isFavorite)),
    };
 };

const LocationImageDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationImageDetail);

export default LocationImageDetailScreen;

interface Style {
    imageContainer: ViewStyle;
    galleryContainer: ViewStyle;
    headerActionContainer: ViewStyle;
    backButtonContainer: TextStyle;
    iconStyle: TextStyle;
    galleryCount: TextStyle;
    footerContainer: ViewStyle;
    footerActionContainer: ViewStyle;
    favoriteButton: TextStyle;
    favoriteIcon: TextStyle;
    activeFavoriteIcon: TextStyle;
    favoriteLabel: TextStyle;
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
        top: 0,
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
    footerContainer: {
        bottom: 0,
        height: 40,
        position: 'absolute',
        backgroundColor: 'transparent',
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
    },
    footerActionContainer: {
        width: '90%',
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingBottom: "2%",
        borderTopColor: "white",
        borderTopWidth: 0.5 
    },
    favoriteButton: {
        textAlign: 'left',
        paddingLeft: "10%",
        paddingTop: "3%"
    },
    favoriteIcon: {
        fontSize: 17
    },
    activeFavoriteIcon: {
        color: "red"
    },
    favoriteLabel: {
        textAlign: 'left',
        color: 'white',
        fontSize: 13,
        fontStyle: 'normal',
        paddingLeft: '2%',
        paddingTop: "3%"
    }
  })