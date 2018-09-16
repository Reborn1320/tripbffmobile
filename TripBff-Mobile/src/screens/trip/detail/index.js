import React, { Component } from "react";
import { Container, Header, Content, Button, Text } from 'native-base';

class TripDetail extends Component {

    render() {
  
      const { tripDetail } = this.props.navigation.state.params;
  
      return (
        <Container>
          <Header />
          <Content>
            <Text>{tripDetail}</Text>
          </Content>
        </Container>
      );
    }
}
  
export default TripDetail;