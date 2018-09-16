import React, { Component } from "react";
import { FlatList } from "react-native";
import { Container, Header, Content, Button, Icon, Text, ListItem } from 'native-base';
import { Footer, FooterTab } from 'native-base';

import { connect } from 'react-redux';

import styles from "./styles";
import { listRepos } from './reducer';

class Home extends Component {

  componentDidMount() {
    this.props.listRepos('relferreira');
  }

  renderItem = ({ item }) => (
    <ListItem>
      <Text style={styles.item} onPress={() => this.props.navigation.navigate("TripDetail", { tripDetail: item.name })}>{item.name}</Text>
    </ListItem>
  );

  render() {

    const { repos } = this.props;

    return (
      <Container>
        <Header />
        <Content>
          <FlatList
            styles={styles.container}
            data={repos}
            renderItem={this.renderItem}
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical>
              <Icon active name="navigate" />
              <Text>Search</Text>
            </Button>
            <Button vertical
              onPress={() => this.props.navigation.navigate("TripCreation")}>
              <Icon type="FontAwesome" name="plus-circle" />
              <Text>Create</Text>
            </Button>

            <Button vertical active>
              <Icon name="person" />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  let storedRepositories = state.repos.map(repo => ({ key: repo.id, ...repo }));
  return {
    repos: storedRepositories
  };
};

const mapDispatchToProps = {
  listRepos
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
// export default Home;
