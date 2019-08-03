import * as React from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { getLabel } from "../../i18n";
import { SearchBar } from 'react-native-elements';
import NBColor from "../theme/variables/material.js";
import { mixins } from "../_utils";


class SearchBarComponent extends React.PureComponent<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            search: ''
        }
    }

    private _updateSearch = (search) => {
        this.setState({
            search: search
        });
        this.props.updateSearch(search);
    }

    render() {
        return (
            <SearchBar
                placeholder={getLabel("action.search")}
                placeholderTextColor={"#DADADA"}
                onChangeText={this._updateSearch}
                value={this.state.search}
                lightTheme={true}
                containerStyle={styles.containerStyle}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                searchIcon={{ name: "md-search", type: "ionicon", color: "#1A051D", size: 22}}
                clearIcon={{ name:"md-close-circle", type: "ionicon", color: "#383838", size: 22}}
            />
        )        
    }
}

interface Style {
    containerStyle: ViewStyle;
    inputContainerStyle: ViewStyle;
    inputStyle: TextStyle;
}

const styles = StyleSheet.create<Style>({
    containerStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    inputContainerStyle: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderBottomWidth: 1, 
        borderStyle: "solid",
        borderColor: "#DADADA",
        borderRadius: 4
    },
    inputStyle: {
        fontFamily: mixins.themes.fontNormal.fontFamily,
        fontStyle: "normal",
        fontSize: 18,
        color: "#383838"
    }
});


export default SearchBarComponent;