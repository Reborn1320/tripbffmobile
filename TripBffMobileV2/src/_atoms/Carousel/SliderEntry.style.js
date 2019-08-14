import { StyleSheet, Dimensions, Platform } from "react-native";
import { colors } from "./index.style";
import { mixins } from "../../_utils";
import NBTheme from "../../theme/variables/material";
import NBColor from "../../theme/variables/commonColor.js";

const IS_IOS = Platform.OS === "ios";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(90);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = viewportWidth - 24;

const entryBorderRadius = 6;

export default StyleSheet.create({
  slideInnerContainer: {
    width: "100%",
    height: slideHeight,
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
    elevation: 0.7,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: "transparent",
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    marginRight: 24,
  },
  imageContainerEven: {
    backgroundColor: NBTheme.brandPrimary,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    // borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  imageEmptyContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: "white",
  },
  radiusMaskEven: {
    backgroundColor: colors.black,
  },
  radiusMaskBorder: {
    borderColor: "lightgrey",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // borderStyle: "dashed",
  },
  textContainer: {
    justifyContent: "center",
    paddingTop: 13,
    paddingBottom: 13,
    paddingHorizontal: 16,
    marginRight: 24,
    backgroundColor: NBColor.brandPrimary,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  textContainerEven: {
    backgroundColor: NBTheme.brandPrimary,
  },
  textContainerBorder: {
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    ...mixins.themes.fontNormal,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  titleEven: {
    color: "white",
  },
  subtitle: {
    marginTop: 6,
    color: "#DADADA",
    fontSize: 12,
    ...mixins.themes.fontBold,
    lineHeight: 16,
  },
  subtitleEven: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
