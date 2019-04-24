import React from "react";
import { TextInput, Dimensions, ViewStyle, StyleSheet } from 'react-native'
import { Text, View, Icon } from "native-base";
import _, { } from "lodash";
import { connectStyle } from 'native-base';

export interface Props {
    description: string,
    openUpdateLocationDescriptionModalHandler: () => void
}

export interface State {
}

class LocationDescriptionComponent extends React.PureComponent<Props, State> { 

    _openUpdateLocationDescriptionModal = () => {
        this.props.openUpdateLocationDescriptionModalHandler();
    }

    render() {
        return (
            <View>
                <Text>Description</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        placeholder = "What are your feeling?"
                        multiline = {true}      
                        value = {this.props.description}                  
                        numberOfLines = {3}
                        editable = {false}
                        style={[styles.textInput, { fontSize: 18 }]}
                    />
                    <Icon name='pencil-alt' type="FontAwesome5" style={[styles.icon, {fontSize: 20}]} 
                            onPress={this._openUpdateLocationDescriptionModal}/>    
                </View>
            </View>
        );
    }
}

interface Style {
    textInputContainer: ViewStyle,
    textInput: ViewStyle,
    icon: ViewStyle
  }
  
  const styles = StyleSheet.create<Style>({
    textInputContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center', 
        borderRadius: 8,
        borderWidth: 0.2,
        borderColor: '#d6d7da',
        marginTop: 10
    },
    textInput: {
        width: Dimensions.get('window').width - 50,        
        margin: 10
    },
    icon: {
        marginRight: 10
    }
  })
    
  const LocationDescription = 
      connectStyle<typeof LocationDescriptionComponent>('NativeBase.Modal', styles)(LocationDescriptionComponent);
  
  export default LocationDescription;