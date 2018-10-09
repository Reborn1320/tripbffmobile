import React, { Component } from 'react'
import { View, Text, Button, Icon, Thumbnail } from 'native-base';
import { LocationVM } from '..';

export interface Props {
    dayIdx: number
    locations: LocationVM[]
}

export interface State {
    // locationIdx: number
}

export default class DayItem extends React.Component<Props, State> {
    render() {
        const { dayIdx, locations } = this.props
        console.log("DayItem")
        console.log(locations)
        var firstItemUrl = locations.length > 0 ? locations[0].images[0].url : undefined
        return (
            <View>
                <Text>Day {dayIdx}</Text>
                <Button>
                    <Icon type={"FontAwesome"} name="plus" />
                </Button>
            {/* //list of location items */}
            {firstItemUrl && 
            <Thumbnail square large
                    style={{ width: 120, height: 120 }} //TODO: use screen dimension to scale differently :D
                    source={{ uri: firstItemUrl }}
                />
            }
            </View>
        )
    }
}
