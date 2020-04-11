import React from "react";
import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native'
import { View, Text } from "native-base";
import _ from "lodash";
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../../_molecules/ImageList/ImageList";
import NBTheme from "../../../theme/variables/material.js";
import { ImageFavorable } from "../../../_molecules/ImageList/ImageFavorable";
import { mixins } from "../../../_utils";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import { StoreData } from "../../../store/Interfaces";
import { connect } from "react-redux";
import { NavigationConstants } from "../../../screens/_shared/ScreenConstants";

export interface Props {
  tripId: string,
  canContribute: boolean,
  photos: Array<ILocationMediaImage>
}

export interface State {
  itemWidth: number
}

interface ILocationMediaImage {
  imageId: string;
  url: string;
  isFavorite: boolean;
}

class TripAllPhotosComponent extends React.PureComponent<Props & PropsBase, State> {

  constructor(props) {
    super(props);

    let { itemWidth } = calculateImageListWidth(15, 15);
    this.state = {
      itemWidth: itemWidth
    }
  } 
  
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: screenProps.t("trip_all_photos:screen_header_title"),
      headerRight: (<View></View>)
    };
  };

  private _onSelect = (imageId: string) => {
    const { tripId, photos, canContribute } = this.props;
    const img = _.find(photos, im => im.imageId == imageId);
    const { isFavorite } = img;
    this.props.navigation.navigate(NavigationConstants.Screens.LocationImageDetails,
        { 
            tripId, imageId, isFavorite, canContribute
        });
    }

  private renderItem2 = (itemInfo: { item: ILocationMediaImage, index: number, styleContainer: ViewStyle }) => {
    const img = itemInfo.item;

    const itemWidth = this.state.itemWidth;
    return (
        <ImageFavorable
          key={img.imageId}
          imageUrl={img.url} width={itemWidth}
          isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
          isFirstRow={itemInfo.index < N_ITEMS_PER_ROW}

          onPress={() => this._onSelect(img.imageId)}

          isChecked={img.isFavorite}          
          canContribute={this.props.canContribute}
        />
      )
  }

  render() {
    let { photos } =  this.props;

    return (
      <View style={styles.mediaContainer}>
        {
            photos &&
            <ImageList
            items={photos}
            renderItem={this.renderItem2}
            />
        }
      </View>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
    var trip = storeState.currentTrip;
    var photos: ILocationMediaImage[] = [];
    var tripId: string = "";

    if (trip) {
        tripId = trip.tripId;

        trip.dates.forEach(date => {
            date.locations.forEach(location => {
                var locationPhotos : ILocationMediaImage[] = location.images.map(item => {
                    return {
                        imageId: item.imageId,
                        url: item.externalUrl,
                        isFavorite: item.isFavorite
                    }
                });
                photos = [...photos,...locationPhotos];
            });
        });
    }

    return {
      tripId: tripId,
      photos: photos
    };
  };
  
  const TripAllPhotos = connect(
    mapStateToProps,
    null
  )(TripAllPhotosComponent);
  
export default withNamespaces(['trip_all_photos'])(TripAllPhotos);

interface Style {
  mediaContainer: ViewStyle;
  headerText: TextStyle;
  normalImage: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  mediaContainer: {
    display: "flex",
    backgroundColor: NBTheme.cardDefaultBg,
    borderRadius: NBTheme.borderRadiusBase / 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 15,

  },
  headerText: {
    color: NBTheme.brandPrimary,
    ...mixins.themes.fontBold,
    marginBottom: 10,
  },
  normalImage: {

  },
})
