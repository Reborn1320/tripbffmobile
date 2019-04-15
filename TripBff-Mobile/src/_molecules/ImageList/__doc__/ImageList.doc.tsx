import React, { Component } from "react";
import { Container, Header, Content, View, Text } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";
import { mixins } from "../../../_utils";
import ImageList from "../ImageList";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  isLoaded: boolean;
  items: any[];
}

class ImageListDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    const items =

      this.state = {
        isLoaded: false,
        items: Array.from({ length: 50 }, (v, i) => i)
      }
  }

  private renderItem = (index: number) => {
    return (
      <View
        style={{
          width: "100%",
          height: 120,
          backgroundColor: "orange"
        }}>
        <Text>{this.state.items[index]}</Text>
      </View>
    );
  };

  render() {
    const { isLoaded, items } = this.state
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
            <ImageList
              items={items} renderItem={this.renderItem} />
          </View>

        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
  // const { tripId } = ownProps.navigation.state.params
  // var trip = _.find(storeState.trips, (item) => item.id == tripId)
  return {
    // trip
  };
};

const mapDispatchToProps: IMapDispatchToProps = {
};

const ImageListDocScreen = connect(mapStateToProps, mapDispatchToProps)(ImageListDoc);

export default ImageListDocScreen;

