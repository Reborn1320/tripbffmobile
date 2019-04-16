import React, { Component } from "react";
import { Container, Header, Content, View, Text } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";
import { mixins } from "../../../_utils";
import LocationMedia from "../LocationMedia";
import { Button } from "react-native";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  isLoaded: boolean;
  images: { imageId: string, url: string }[];
  isMassSelection: boolean;
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
      isMassSelection: false,
    }
  }

  private onMassSelection = () => {
    this.setState({ isMassSelection: true });
  }
  render() {
    const { isLoaded, images, isMassSelection } = this.state
    return (
      <Container>
        <Header>
          {isMassSelection &&
          (<View style={{ display: "flex", flexDirection: "row" }}>
            <Button
              onPress={() => this.setState({ isMassSelection: false })}
              title="Cancel">
            </Button>
            <Button
              onPress={() => this.setState({ isMassSelection: false })}
              title="Complete selection">
            </Button>
          </View>)
          }
        </Header>
        <Content>
          <View>
            <Text>some thing here</Text>
            <Text>some thing here</Text>
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
              images={images} />
          </View>

        </Content>
      </Container>
    );
  }
}

const LocationMediaDocScreen = LocationMediaDoc;

export default LocationMediaDocScreen;

