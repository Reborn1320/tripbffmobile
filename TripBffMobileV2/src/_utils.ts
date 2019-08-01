import { ViewStyle, TextStyle } from "react-native";

export const mixins: Mixins = {
  themes: {
    debug: {
      borderColor: "orange",
      borderWidth: 1,
    },
    debug1: {
      borderColor: "red",
      borderWidth: 1,
    },
    debug2: {
      borderColor: "blue",
      borderWidth: 1,
    },
    displayFlex: {
      display: "flex"
    },
    fontNormal: {
      fontFamily: "Nunito-Regular"
    },
    fontSemiBold: {
      fontFamily: "Nunito-SemiBold"
    },
    fontBold: {
      fontFamily: "Nunito-Bold"
    },
    fontExtraBold: {
      fontFamily: "Nunito-ExtraBold"
    }
  },
  centering: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
}

type Mixins = {
  themes: {
    debug: ViewStyle,
    debug1: ViewStyle,
    debug2: ViewStyle,
    displayFlex: ViewStyle,
    fontNormal: TextStyle,
    fontSemiBold: TextStyle,
    fontBold: TextStyle,
    fontExtraBold: TextStyle,
  }
  centering: ViewStyle
}
