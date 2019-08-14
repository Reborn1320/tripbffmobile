import { StyleSheet } from "react-native";
import { mixins } from "../../_utils";

export const colors = {
  black: "#1a1917",
  gray: "#888888",
  background1: "#B721FF",
  background2: "#21D4FD",
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollview: {
    flex: 1,
  },
  exampleContainer: {
    paddingVertical: 0,
  },
  exampleContainerDark: {
    backgroundColor: "transparent",
  },
  exampleContainerLight: {
    backgroundColor: "transparent",
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 20,
    ...mixins.themes.fontBold,
    textAlign: "center",
  },
  titleDark: {
    color: colors.black,
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },
  slider: {
    overflow: "visible", // for custom animations
  },
  sliderContentContainer: {},
  paginationContainer: {
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 0,
    backgroundColor: "#FFFFFF",
  },
  inactivePaginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 0,
    backgroundColor: colors.gray,
  },
});
