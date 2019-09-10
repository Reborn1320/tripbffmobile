import React, { Component } from "react";
import { Container, Content, View } from 'native-base';
import _, { } from "lodash";
// import { mixins } from "../../../_utils";
import ImportImageLocationItem from "./ImportImageLocationItem";
import { TripImportLocationVM } from "../TripImportViewModels";
import moment from "moment";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
}

const location0: TripImportLocationVM = {
  id: "000",
  name: "This is suppose to be a long name, let make it longer",
  fromTime: moment(),
  toTime: moment(),
  location: {
    address: "234 ada asdf, 23 23, Ho Chi Minh",
    lat: 123123,
    long: 12251
  },
  images: [
    {
      imageId: "000",
      isSelected: true,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    },
    {
      imageId: "000",
      isSelected: true,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    },
    {
      imageId: "000",
      isSelected: false,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    },
    {
      imageId: "000",
      isSelected: true,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    }
  ]
}

const location1: TripImportLocationVM = {
  id: "001",
  name: "Wayne Coffee",
  fromTime: moment(),
  toTime: moment(),
  location: {
    address: "234 ada asdf, 23 23, Ho Chi Minh",
    lat: 123123,
    long: 12251
  },
  images: [
    {
      imageId: "000",
      isSelected: false,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    },
    {
      imageId: "000",
      isSelected: false,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    },
    {
      imageId: "000",
      isSelected: false,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    },
    {
      imageId: "000",
      isSelected: false,
      time: moment(),
      url: "https://placekitten.com/g/200/200"
    }
  ]
}

export default class ImportImageLocationItemDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
    }
  }


  render() {
    const { } = this.state
    return (
      <Container>
        <Content>
          <View
            style={{
              // marginTop: 20,
            }}
          >
            <ImportImageLocationItem
              locationIdx={0}
              location={location0}
              handleSelect={() => {}}
              handleSelectAll={() => {}}
            />
            <ImportImageLocationItem
              locationIdx={0}
              location={location1}
              handleSelect={() => {}}
              handleSelectAll={() => {}}
            />
            <ImportImageLocationItem
              locationIdx={0}
              location={location0}
              handleSelect={() => {}}
              handleSelectAll={() => {}}
            />
          </View>

        </Content>
      </Container>
    );
  }
}