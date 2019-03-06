import React from 'react'
import { View, Text, Button, Icon } from 'native-base';
import { LocationVM } from '../../../_organisms/Trip/TripDetails/TripDetails';
import LocationItem from './LocationItem';
import moment from 'moment';

export interface Props {
    dayIdx: number
    locations: LocationVM[]
    date: moment.Moment
    toLocationDetailHandler: (locationId: string) => void
    removeLocationHandler: (locationId: string) => void
    addLocationHandler: (dayIdx: number, date: moment.Moment) => void
}

export interface State {
    // locationIdx: number
}

export default class DayItem extends React.Component<Props, State> {
    render() {
        const { dayIdx, locations, date } = this.props
        return (
            <View>
                <View style={{display: "flex", alignItems: "stretch", flexDirection: "row", paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{color: "darkred", fontSize: 20}}>Day {dayIdx}</Text>
                    <Button small transparent
                            onPress= {() => this.props.addLocationHandler(dayIdx, date)}>
                        <Icon type={"FontAwesome"} name="plus" />
                    </Button>
                </View>

                {locations.map(e => 
                <LocationItem location={e} key={e.id} 
                    toLocationDetailHandler={(locationId) => this.props.toLocationDetailHandler(locationId)} 
                    removeLocationHandler={(locationId) => this.props.removeLocationHandler(locationId)}
                    >
                </LocationItem>)}
            </View>
        )
    }
}
