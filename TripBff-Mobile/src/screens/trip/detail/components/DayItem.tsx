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
        return (
            <View>
                <View style={{display: "flex", alignItems: "stretch", flexDirection: "row", paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{color: "darkred", fontSize: 20}}>Day {dayIdx}</Text>
                    <Button small transparent>
                        <Icon type={"FontAwesome"} name="plus" />
                    </Button>
                </View>

                {locations.map(e => <LocationItem location={e} key={e.id} ></LocationItem>)}
            </View>
        )
    }
}
