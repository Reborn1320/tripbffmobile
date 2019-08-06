import * as React from "react";
import { Spinner, View, Text } from "native-base";
import { mixins } from "../../_utils";

interface LoadingProps {
  message: string;
}
const Loading: React.SFC<LoadingProps> = props => {
  return (
    <View style={{display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Spinner color="grey" />
      <Text style={{color: "grey", width: "80%", ...mixins.themes.fontNormal, textAlign: "center" }}>{props.message}</Text>
    </View>
  );
};

export default Loading;
