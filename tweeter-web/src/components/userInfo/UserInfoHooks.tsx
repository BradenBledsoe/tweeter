import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";

export const userInfoActions = () => {
  return useContext(UserInfoActionsContext);
};

export const userInfoList = () => {
  return useContext(UserInfoContext);
};
