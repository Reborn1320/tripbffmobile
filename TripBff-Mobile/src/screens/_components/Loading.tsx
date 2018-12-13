import * as React from "react";
import { Spinner, View, Text } from "native-base";

interface LoadingProps {
  message: string;
}
const Loading: React.SFC<LoadingProps> = props => {
  return (
    <View style={{display: "flex", flexDirection: "column", alignItems: "center", borderColor: "orange", borderWidth: 1 }}>
      <Spinner color="grey" />
      <Text style={{color: "grey", width: "80%" }}>{props.message}</Text>
    </View>
  );
};

export default Loading;
