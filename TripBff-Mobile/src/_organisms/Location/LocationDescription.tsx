import React from "react";
import { Dimensions, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Text, View, Icon } from "native-base";
import _, { } from "lodash";
import { connectStyle } from 'native-base';
import  ReadMore from 'react-native-read-more-text';
import ViewMoreText from 'react-native-view-more-text';
import { TextInput } from "react-native-gesture-handler";

export interface Props {
    description: string,
    openUpdateLocationDescriptionModalHandler: () => void
}

export interface State {
}

class LocationDescriptionComponent1 extends React.PureComponent<Props, State> { 

    _openUpdateLocationDescriptionModal = () => {
        this.props.openUpdateLocationDescriptionModalHandler();
    }

    renderViewMore(onPress){
        return(
          <Text style={styles.showMoreLessBtn} onPress={onPress}>View more</Text>
        )
      }

    renderViewLess(onPress){
        return(
            <Text style={styles.showMoreLessBtn} onPress={onPress}>View less</Text>
        )
    }

    render() {
        return (
            <View>
                <View>
                    <Text>
                        Description
                    </Text>
                </View>
                <View style={styles.textInputContainer}>
                {
                    this.props.description
                    ?
                        (
                            <ViewMoreText
                                numberOfLines={3}                        
                                renderViewMore={this.renderViewMore}
                                renderViewLess={this.renderViewLess}   
                                textStyle={styles.textInput}                     
                                >
                                <Text>
                                    {this.props.description}
                                </Text>
                            </ViewMoreText>
                        )
                    : (
                        <TextInput
                            placeholder = "What are your feeling?"
                            multiline = {true}                        
                            numberOfLines = {3}
                            editable = {false}
                            style={[styles.textInput, { fontSize: 18 }]}
                        />
                    )
                }
                                       
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
    icon: ViewStyle,
    showMoreLessBtn: TextStyle
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
        marginLeft: 10,
        marginTop: 5
    },
    icon: {
        marginRight: 10
    },
    showMoreLessBtn: {
        color: 'blue',
        marginLeft: 10
    }
  })
    
  const LocationDescription = 
      connectStyle<typeof LocationDescriptionComponent1>('NativeBase.Modal', styles)(LocationDescriptionComponent1);
  
  export default LocationDescription;