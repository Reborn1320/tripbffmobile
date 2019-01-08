import React, { Component } from "react";
import { Container, Header, Content, Text, View } from "native-base";
import { FlatList } from "react-native";
import _ from "lodash";
import Loading from "../_components/Loading";

export interface IStateProps {
}

interface IMapDispatchToProps {
  fetchTrips?: () => Promise<Array<any>>;
}

export interface Props extends IMapDispatchToProps {
  trips: Array<any>
}

interface State {
}


export class TripsComponent extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);
  }

  _renderItem = itemInfo => {
    return (<Text>trip item</Text>);
  };

  // shouldComponentUpdate() {
  //   console.log("shouldComponentUpdate")
  //   return true;
  // }

  render() {
    const { trips } = this.props;
    // console.log("TripsComponent", trips);
    console.log("trips component render");
    return (
      <View>
          <FlatList
            // styles={styles.container}
            data={trips}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => String(index)}
          />
      </View>
    );
  }
}