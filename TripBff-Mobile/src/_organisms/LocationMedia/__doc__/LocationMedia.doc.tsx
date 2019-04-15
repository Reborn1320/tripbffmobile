import React, { Component } from "react";
import { Container, Header, Content, View, Text } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";
import { mixins } from "../../../_utils";
import LocationMedia from "../LocationMedia";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  isLoaded: boolean;
  images: any[];
}

class LocationMediaDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

      this.state = {
        isLoaded: false,
        images: Array.from({ length: 50 }, (v, i) => {
          return {
            url: "https://placekitten.com/g/200/200"
          };
        })
      }
  }

  render() {
    const { isLoaded, images } = this.state
    return (
      <Container>
        <Header></Header>
        <Content>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <LocationMedia
              images={images} />
          </View>

        </Content>
      </Container>
    );
  }
}

const LocationMediaDocScreen = LocationMediaDoc;

export default LocationMediaDocScreen;

