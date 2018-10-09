import React, { Component } from 'react'
import { View, Text, Button, Icon, Thumbnail } from 'native-base';
import { LocationVM } from '..';
import LocationItem from './LocationItem';

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
        return (
            <View>
                <Text>Day {dayIdx}</Text>
                <Button small rounded>
                    <Icon type={"FontAwesome"} name="plus" />

                </Button>
                {locations.map(e => <LocationItem location={e} key={e.id} ></LocationItem>)}
            </View>
        )
    }
}
