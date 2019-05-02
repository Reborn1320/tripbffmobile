declare module "native-base" {
  namespace NativeBase {

    interface Icon {
      name: string;
      type?: "AntDesign" | "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "FontAwesome5" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial";
      // TODO position attribute of ReactNative.FlexStyle hasn't another position values without "absolute" and "relative"
      style?: any;
      onPress?: (e?: any) => any;
      active?: boolean;
      ios?: string;
      android?: string;
      color?: string;
      fontSize?: number;
      solid?: boolean; //copy from native base and add this props for react-native-icons...
    }
    // export class Icon extends React.Component<NativeBase.Icon, any> { }
  }
}