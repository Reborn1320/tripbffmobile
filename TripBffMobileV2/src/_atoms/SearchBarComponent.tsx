import * as React from "react";
import { StyleSheet, ViewStyle, TextStyle, Image, ImageStyle } from "react-native";
import { SearchBar } from 'react-native-elements';
import { mixins } from "../_utils";
import { withNamespaces } from "react-i18next";


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
        const { t } = this.props;

        return (
            <SearchBar
                placeholder={t("action:search")}
                placeholderTextColor={"#DADADA"}
                onChangeText={this._updateSearch}
                value={this.state.search}
                lightTheme={true}
                containerStyle={styles.containerStyle}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                searchIcon={<Image
                    style={styles.searchIcon}
                    source={require('../../assets/SearchIcon.png')}
                  />}
                clearIcon={{ name:"md-close-circle", type: "ionicon", color: "#383838", size: 22}}
            />
        )        
    }
}

interface Style {
    containerStyle: ViewStyle;
    inputContainerStyle: ViewStyle;
    inputStyle: TextStyle;
    searchIcon: ImageStyle;
}

const styles = StyleSheet.create<Style>({
    containerStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,
        marginLeft: "3%",
        marginRight: "3%"
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
    },
    searchIcon: {
        marginLeft: 10
    }
});


export default withNamespaces(['action'])(SearchBarComponent);