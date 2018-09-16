import React, { Component } from "react";
import { FlatList } from "react-native";
import { Container, Header, Content, Button, Text } from 'native-base';

import { connect } from 'react-redux';

import styles from "./styles";
import { listRepos } from './reducer';

class Home extends Component {

  componentDidMount() {
    this.props.listRepos('relferreira');
  }

  renderItem = ({ item }) => (
    <Text style={styles.item} onPress={() => this.props.navigation.navigate("TripDetail", { tripDetail: item.name })}>{item.name}</Text>
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
