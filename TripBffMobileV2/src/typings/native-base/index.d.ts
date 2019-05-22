import { StyleSheet } from "react-native";
import { ReactElement, FunctionComponentElement } from "react";

declare module "native-base" {
  function connectStyle<REType = any>(name: string, style: any): (element: REType) => REType;
}