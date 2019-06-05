import { StyleSheet } from 'react-native';
import NBTheme from "./material.js";

export default StyleSheet.create({
    optionsContainer: {
        borderRadius: NBTheme.borderRadiusBase,
     },
    optionWrapper: {
        // ...mixins.themes.debug,
        height: NBTheme.inputHeightBase,
        alignItems: "stretch",
        justifyContent: "center",
        paddingLeft: 15,
    },
    optionText: {
        fontFamily: NBTheme.fontFamily,
        fontSize: NBTheme.btnTextSize,
    }
});