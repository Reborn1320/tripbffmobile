import React, { PureComponent } from "react";
import {  ActivityIndicator } from "react-native";
import { View, Container, Content } from "native-base";
import { StoreData } from "../../../store/Interfaces";
import _, { } from "lodash";
import ImageList, { calculateImageListWidth, N_ITEMS_PER_ROW } from "../../../_molecules/ImageList/ImageList";
import { ImageSelection } from "../../../_molecules/ImageList/ImageSelection";

interface ImageProps {
    images: Array<StoreData.ImportImageVM>,
    isExistedCurrentTrip: boolean,
    updateSelectedImagesUrl: (imageUrls: Array<any>) => void
  }
  
export default class PreviewImages extends PureComponent<ImageProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            loadedImages: false
        };
    }    

    componentDidMount() {
        // handle when navigate from Trip Detaisl/Edit
        if (this.props.isExistedCurrentTrip) this._handleInitImages(true);
    }

    componentDidUpdate() {
        // handle when navigate from Profile
        if (!this.state.loadedImages) this._handleInitImages(true);
    }

    private _handleInitImages = (loadedImages) => {
        if (this.props.images) {
            this.setState({ images: this.props.images, loadedImages: loadedImages });
        }
    }

    private _handleSelect(img) {
        var newImages = this.state.images.map(item => item.imageId != img.imageId ? item : {
                                            ...item,
                                            isSelected: !img.isSelected
                                        });        
        let selectedImageUrls = newImages.filter(item => item.isSelected).map(item => {
        return {
            imageId: item.imageId,
            externalUrl: item.externalUrl
        }
        });    

        this.setState({images: newImages});
        this.props.updateSelectedImagesUrl(selectedImageUrls);  
    }

    private renderItem = (itemInfo: { item: any, index: number }) => {
        const img = itemInfo.item;
        const { itemWidth } = calculateImageListWidth();

        return (
            <ImageSelection
                key={itemInfo.index}
                imageUrl={img.thumbnailExternalUrl}
                width={itemWidth}
                isChecked={img.isSelected}
                isDisplayFavorited={img.isFavorite}

                isFirstItemInRow={itemInfo.index % N_ITEMS_PER_ROW == 0}
                isFirstRow={ itemInfo.index < N_ITEMS_PER_ROW }

                onPress={() => this._handleSelect(img)}
            />
        );
    }

    render() {
        return (
            <Container>
                <Content>
                    <View>
                        {
                        this.state.images ?
                            <ImageList
                            items={this.state.images}
                            renderItem={this.renderItem}
                        />
                        : <ActivityIndicator size="small" color="#00ff00" />
                        }
                    </View>
                </Content>
            </Container>
        );
    } 
}  