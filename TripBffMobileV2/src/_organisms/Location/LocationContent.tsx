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
    name: string,
    address: string,
    likeItems: Array<StoreData.LocationLikeItemVM>,
    description: string,
    images: Array<StoreData.ImportImageVM>

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
        const { isMassSelection, selectedImageIds } = this.props;
        return (
            <View style={styles.container}>
                <LocationName
                    locationName={this.props.name}
                    locationAddress={this.props.address}
                    openUpdateLocationAddressModalHanlder={this.props.openUpdateLocationAddressModalHanlder}>
                </LocationName>

                <LocationLike
                    likeItems={this.props.likeItems}
                    openUpdateLocationHighlightModalHanlder={this.props.openUpdateLocationHighlightModalHanlder}>
                </LocationLike>

                <LocationDescription
                    description={this.props.description}
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