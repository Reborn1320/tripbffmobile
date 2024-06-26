import React from "react";
import _ from "lodash";
import FastImage, {
  FastImageSource,
  ImageStyle,
} from "react-native-fast-image";
import { getAuthorizationHeader } from "../store/ApisAsAService";

export interface Props {
  source: FastImageSource;
  style?: ImageStyle;
}

export default function AuthorizedImage(props: Props) {
  return (
    <FastImage
      source={{
        ...props.source,
        headers: {
          Authorization: getAuthorizationHeader(),
        },
      }}
      style={props.style}
    />
  );
}