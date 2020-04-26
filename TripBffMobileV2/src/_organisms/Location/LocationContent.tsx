import React from 'react'
import { View } from 'native-base';
import { StoreData } from '../../store/Interfaces';
import _ from "lodash";
import LocationName from './LocationName'
import LocationLike from './LocationLike'
import LocationDescription from './LocationDescription'
import LocationMedia from './LocationMedia'
import { StyleSheet, ViewStyle } from 'react-native';

interface IMapDispatchToProps {
    openUpdateLocationAddressModalHanlder: () => void
    openUpdateLocationHighlightModalHanlder: () => void
    openUpdateLocationDescriptionModalHandler: () => void
}

export interface Props extends IMapDispatchToProps {
    locale: string,

    name: string,
    address: string,
    likeItems: Array<StoreData.LocationLikeItemVM>,
    description: string,
    images: Array<StoreData.ImportImageVM>
    canContribute: boolean

    isMassSelection: boolean;
    selectedImageIds: string[]
    onFavorite: (imageId: string) => void
    onSelect: (imageId: string) => void
    onMassSelection: () => void
    onAddingImages: () => void
}

interface State {
}

export default class LocationContent extends React.PureComponent<Props, State> {
    render() {
        const { isMassSelection, selectedImageIds, canContribute } = this.props;
        return (
            <View style={styles.container}>
                <LocationName
                    locationName={this.props.name}
                    locationAddress={this.props.address}
                    canContribute={canContribute}
                    openUpdateLocationAddressModalHanlder={this.props.openUpdateLocationAddressModalHanlder}>
                </LocationName>

                <LocationLike
                    locale={this.props.locale}
                    likeItems={this.props.likeItems}
                    canContribute={canContribute}
                    openUpdateLocationHighlightModalHanlder={this.props.openUpdateLocationHighlightModalHanlder}>
                </LocationLike>

                <LocationDescription
                    description={this.props.description}
                    canContribute={canContribute}
                    openUpdateLocationDescriptionModalHandler={this.props.openUpdateLocationDescriptionModalHandler}>
                </LocationDescription>

                <LocationMedia
                    images={this.props.images.map(img => ({
                        imageId: img.imageId,
                        url: img.thumbnailExternalUrl,
                        isFavorite: img.isFavorite
                    }))}
                    massSelection={isMassSelection}
                    onMassSelection={this.props.onMassSelection}
                    onFavorite={this.props.onFavorite}
                    onSelect={this.props.onSelect}
                    selectedImageIds={selectedImageIds}

                    onAddingImages={this.props.onAddingImages}

                    canContribute={canContribute}
                >
                </LocationMedia>
            </View>
        )
    }
}

interface Style {
    container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        padding: 15,
        marginBottom: 45,
    },
});