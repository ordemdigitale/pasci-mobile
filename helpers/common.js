import { Dimensions } from "react-native";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get("window");
export const hp = percentage => {return (percentage*deviceHeight) / 100;}
export const wp = percentage => {return (percentage*deviceWidth) / 100;}