import React from 'react'
import { View } from 'native-base';
import { StoreData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import LocationName from './LocationName'
import LocationLike from './LocationLike'
import LocationDescription from './LocationDescription'
import LocationMedia from './LocationMedia'

interface IMapDispatchToProps {
    openUpdateLocationAddressModalHanlder: () => void
}

export interface Props extends IMapDispatchToProps {
    name: string,
    address: string,
    likeItems: Array<StoreData.LocationLikeItemVM>,
    description: string,
    images: Array<StoreData.ImportImageVM>
}

interface State {
}

export default class LocationContent extends React.PureComponent<Props, State> {
    render() {
        return (
            <View>
                    <LocationName 
                        locationName={this.props.name}
                        locationAddress={this.props.address}
                        openUpdateLocationAddressModalHanlder={this.props.openUpdateLocationAddressModalHanlder}>                        
                    </LocationName>

                    <LocationLike
                        likeItems={this.props.likeItems}>                        
                    </LocationLike>

                    <LocationDescription
                        description={this.props.description}>                        
                    </LocationDescription>

                    <LocationMedia
                        images={this.props.images}>                        
                    </LocationMedia>
            </View>
        )
    }
}
