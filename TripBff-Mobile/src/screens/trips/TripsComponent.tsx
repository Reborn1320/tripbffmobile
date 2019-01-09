import React, { Component } from "react";
import { Container, Header, Content, Text, View } from "native-base";
import { FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import _ from "lodash";
import Loading from "../_components/Loading";

export interface IStateProps {
}

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  handleClick: (trip: any) => void;
  trips: Array<any>
}

interface State {
}


export class TripsComponent extends Component<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);
  }

  _renderItem = itemInfo => {
    const trip = itemInfo.item;
    return (
      <TouchableOpacity style={{ width: "100%", height: "100px" }}
        onPress={() => this.props.handleClick(trip)}>
        <Text>trip item</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { trips } = this.props;
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