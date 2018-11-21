import React from "react";
import { FlatList } from "react-native";
import { Container, Header, Content, Button, Icon, Text, ListItem } from 'native-base';
import { Footer, FooterTab } from 'native-base';

import { connect, DispatchProp } from 'react-redux';

import styles from "./styles";
import { listRepos } from './reducer';
import * as RNa from "react-navigation";
import Loading from "../_components/Loading";

export interface Props extends IMapDispatchToProps, DispatchProp {
  navigation: RNa.NavigationScreenProp<any, any>
  repos: Array<any>
}

interface IMapDispatchToProps {
  listRepos: (name: string) => void
}

class Home extends React.Component<Props>  {

  componentDidMount() {
    this.props.listRepos('relferreira');
  }

  renderItem = ({ item }) => (
    <ListItem noIndent
    onPress={() => this.props.navigation.navigate("TripDetail", { tripDetail: item.name })}>
      <Text
        style={styles.item}
        
      >
        {item.name}
      </Text>
    </ListItem>
  );

  render() {

    const { repos } = this.props;

    return (
      <Container>
        <Header />
        <Content>
          <Loading message="aaaaaasdad asd asd asd asda sdas da sdas dasd as" />
          {/* <FlatList
            style={styles.container}
            data={repos}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => String(index)}
          /> */}
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
  let storedRepositories = state.repo.repos.map(repo => ({ key: repo.id, ...repo }));
  return {
    repos: storedRepositories
  };
};

const mapDispatchToProps: IMapDispatchToProps = {
  listRepos
};

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeScreen;
// export default Home;
