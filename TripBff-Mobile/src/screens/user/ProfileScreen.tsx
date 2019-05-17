import React, { Component } from "react";
import { Container, Content, Footer, View, Text } from "native-base";
import _ from "lodash";
import Loading from "../../_atoms/Loading/Loading";
import { TripsComponent } from "../../_organisms/Trips/TripsList/TripsComponent";
import AppFooter from "../shared/AppFooter";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import { Avatar, Divider } from "react-native-elements";
import { UserDetails } from "../../_organisms/User/UserDetails";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import styles, { colors } from './index.style';
import SliderEntry from './SliderEntry';
import { sliderWidth, itemWidth } from './SliderEntry.style';

export const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/UYiroysl.jpg'
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'https://i.imgur.com/MABUbpDl.jpg'
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
    },
    {
        title: 'Middle Earth, Germany',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/lceHsT6l.jpg'
    }
];

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

export interface IStateProps { }

interface IMapDispatchToProps {
    loginUsingUserPass: (email: string, password: string) => Promise<any>;
    loginUsingFacebookAccessToken: (userId: string, accessToken: string) => Promise<any>;
    fetchTrips: () => Promise<any>;
    addTrips: (trips: Array<StoreData.TripVM>) => void;
}

export interface Props extends IMapDispatchToProps {
  navigation: NavigationScreenProp<any, any>;
  trips: Array<any>;
}

interface State {
    isLoaded: boolean;
    loadingMessage: string;
    UIState: UIState;
}

type UIState = "LOGIN" | "LOADING_TRIP" | "NORMAL";

//todo add profile component
export class ProfileScreen extends Component<Props & IStateProps, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoaded: true,
            loadingMessage: "loading trips belong to this user",
            UIState: "LOADING_TRIP"
        };
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        this.props.fetchTrips().then(trips => {
            // console.log("fetched Trips", trips);

            this.props.addTrips(trips);

            this.setState({
                isLoaded: false,
                loadingMessage: "",
                UIState: "NORMAL",
            });
        });
    }
    
    handleTripItemClick(trip: any) {
        const { tripId } = trip;
        this.props.navigation.navigate(
            NavigationConstants.Screens.TripEdit,
            { tripId, id: tripId }
        );
    }

    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    layoutExample (number, title, type) {
        const isTinder = type === 'tinder';
        return (
            <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Text style={[styles.title, isTinder ? {} : styles.titleDark]}>{`Example ${number}`}</Text>
                <Text style={[styles.subtitle, isTinder ? {} : styles.titleDark]}>{title}</Text>
                <Carousel
                  data={isTinder ? ENTRIES2 : ENTRIES1}
                  renderItem={isTinder ? this._renderLightItem : this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  layout={type}
                  loop={true}
                />
            </View>
        );
    }

    render() {
        const { trips } = this.props;
        const { isLoaded } = this.state;
        // console.log("screen render", isLoaded);
        // console.log("screen render", trips);
        const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');
        const example4 = this.layoutExample(4, '"Tinder-like" layout | Loop', 'tinder');
        return (
            <Container>
                {/* <Header /> */}
                <Content>
                    <View>
                        <UserDetails></UserDetails>
                        <Divider style={
                            {
                                marginTop: 20,
                                marginBottom: 20,
                            }
                        }></Divider>
                        {isLoaded && <Loading message={this.state.loadingMessage} />}
                        { example3 }
                        { example4 }
                        <TripsComponent
                            trips={trips}
                            handleClick={trip => this.handleTripItemClick(trip)}
                        />
                    </View>
                </Content>
                <Footer>
                    <AppFooter
                        navigation={this.props.navigation}
                        activeScreen={NavigationConstants.Screens.Profile}
                    />
                </Footer>
            </Container>
        );
    }
}
