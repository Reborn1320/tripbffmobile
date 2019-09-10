import React, { Component } from "react";
import { Container, Header, Content, View, Text, Button } from 'native-base';
import _, { } from "lodash";
import { mixins } from "../../_utils";
import LocationMedia from "./LocationMedia";
import { ImageSelection } from "../../_molecules/ImageList/ImageSelection";
import { ImageFavorable } from "../../_molecules/ImageList/ImageFavorable";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  isLoaded: boolean;

  isChecked3: boolean;

  images: { imageId: string, url: string, isFavorite: boolean }[];
  isMassSelection: boolean;
  selectedImageIds: string[]
}

class LocationMediaDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoaded: false,
      isChecked3: false,
      images: Array.from({ length: 20 }, (v, i) => {
        return {
          imageId: i.toString(),
          url: "https://placekitten.com/g/200/200",
          isFavorite: false,
        };
      }),
      isMassSelection: false,
      selectedImageIds: [],
    }
  }

  private onMassSelection = () => {
    this.setState({ isMassSelection: true });
  }

  private onSelect = (imageId: string) => {
    if (!this.state.isMassSelection) {
      this.onFavorite(imageId);
      return;
    }

    if (_.indexOf(this.state.selectedImageIds, imageId) == -1) {
      this.setState({
        selectedImageIds: [...this.state.selectedImageIds, imageId]
      })
    }
    else {
      this.setState({
        selectedImageIds: _.remove(this.state.selectedImageIds, (id) => id != imageId)
      })
    }
  }

  private onFavorite = (imageId: string) => {
    if (!this.state.isMassSelection) {
      let imgIdx = _.findIndex(this.state.images, im => im.imageId == imageId);
      let img = this.state.images[imgIdx];

      this.setState({
        images: [
          ..._.slice(this.state.images, 0, imgIdx),
          {
            ...img,
            isFavorite: !img.isFavorite,
          },
          ..._.slice(this.state.images, imgIdx + 1),
        ]
      })
    }
  }

  render() {
    const { images, isMassSelection } = this.state
    return (
      <Container>
        <Header>
          {isMassSelection &&
            (<View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
              <Button transparent
                onPress={() => this.setState({ isMassSelection: false, selectedImageIds: [] })}
              >
                <Text>CANCEL</Text>
              </Button>
              <Button transparent danger
                onPress={() => this.setState({ isMassSelection: false, selectedImageIds: [] })}
              >
                <Text>DELETE</Text>
              </Button>
            </View>)
          }
        </Header>
        <Content>
          <View>
            <Text>some thing here</Text>
            <Text>test selection image</Text>
            <ImageSelection imageUrl="https://placekitten.com/g/200/200" width={120} isChecked={false} onPress={() => true} isFirstRow={true} isFirstItemInRow={true} />
            <ImageSelection imageUrl="https://placekitten.com/g/200/200" width={120} isChecked={true} onPress={() => true} isFirstRow={true} isFirstItemInRow={true} />
            <ImageFavorable imageUrl="https://placekitten.com/g/200/200" width={120} isFirstRow={true} isFirstItemInRow={true}
              isChecked={this.state.isChecked3}
              onPressedOnFavoriteIcon={() => {
                console.log("aaa");
                this.setState({ isChecked3: !this.state.isChecked3 })}} />
            <Text>some thing here</Text>

          </View>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <LocationMedia
              massSelection={isMassSelection}
              onMassSelection={this.onMassSelection}
              images={images}
              onSelect={this.onSelect}
              onFavorite={this.onFavorite}
              selectedImageIds={this.state.selectedImageIds}
            />
          </View>

        </Content>
      </Container>
    );
  }
}

const LocationMediaDocScreen = LocationMediaDoc;

export default LocationMediaDocScreen;

