import React, { Component } from "react";
import { Container, Header, Content, View, Text, Button } from 'native-base';
import _, { } from "lodash";
import { mixins } from "../../../_utils";
import LocationMedia from "../LocationMedia";
import { ImageSelection } from "../../../_molecules/ImageList/ImageSelection";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  isLoaded: boolean;
  images: { imageId: string, url: string }[];
  isMassSelection: boolean;
  selectedImageIds: string[]
}

class LocationMediaDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoaded: false,
      images: Array.from({ length: 50 }, (v, i) => {
        return {
          imageId: i.toString(),
          url: "https://placekitten.com/g/200/200"
        };
      }),
      isMassSelection: true,
      selectedImageIds: [],
    }
  }

  private onMassSelection = () => {
    this.setState({ isMassSelection: true });
  }

  private onSelect = (imageId: string) => {
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

  render() {
    const { isLoaded, images, isMassSelection } = this.state
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
            <ImageSelection imageUrl="https://placekitten.com/g/200/200" width={120} isChecked={false} />
            <ImageSelection imageUrl="https://placekitten.com/g/200/200" width={120} isChecked={true} />
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

