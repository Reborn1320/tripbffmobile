import React, { Component } from "react";
import { Container, Header, Content, View } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import { TripCarousel, ITripEntry } from "./TripCarousel";

export const ENTRIES2 = [
  {
    title: 'Favourites landscapes 1',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/SsJmZ9jl.jpg'
  },
  {
    title: 'Favourites landscapes 2',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/5tj6S7Ol.jpg'
  },
  {
    title: 'Favourites landscapes 3',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    illustration: 'https://i.imgur.com/pmSqIFZl.jpg'
  },
  {
    title: 'Favourites landscapes 4',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    illustration: 'https://i.imgur.com/cA8zoGel.jpg'
  },
  {
    title: 'Favourites landscapes 5',
    subtitle: 'Lorem ipsum dolor sit amet',
    illustration: 'https://i.imgur.com/pewusMzl.jpg'
  },
  {
    title: 'Favourites landscapes 6',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    illustration: 'https://i.imgur.com/l49aYS3l.jpg'
  }
];

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  tripEntry1: ITripEntry;
  tripEmpty: ITripEntry;
  tripEmpty1Location: ITripEntry;
}

export class TripCarouselDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    const tripEntry1: ITripEntry = {
      tripId: "1",
      title: "asdfas fads sss",
      subtitle: "01/May/1018 - 10/May/1028",
      entries: ENTRIES2,
    }

    const tripEmpty: ITripEntry = {
      tripId: "1",
      title: "asdfas fads sss",
      subtitle: "01/May/1018 - 10/May/1028",
      entries: [],
    }

    const tripEmpty1Location: ITripEntry = {
      tripId: "1",
      title: "asdfas fads sss",
      subtitle: "01/May/1018 - 10/May/1028",
      entries: _.cloneDeep(ENTRIES2),
    }
    tripEmpty1Location.entries[0].illustration = "";

    this.state = {
      tripEntry1, tripEmpty, tripEmpty1Location
    }
  }

  render() {
    const { tripEntry1, tripEmpty, tripEmpty1Location } = this.state
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
            <TripCarousel
              tripEntry={tripEmpty}
              handleClick={() => true}
            />
            <TripCarousel
              tripEntry={tripEmpty1Location}
              handleClick={() => true}
            />
            <TripCarousel
              tripEntry={tripEntry1}
              handleClick={() => true}
            />
          </View>

        </Content>
      </Container>
    );
  }
}