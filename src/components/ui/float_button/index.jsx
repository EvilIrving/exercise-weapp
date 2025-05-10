import React from "react";

import "./index.scss";

const FloatButton = ({ onClick, children }) => {
  return (
    <View className="float-button" onClick={onClick}>
      {children}
    </View>
  );
};
export default FloatButton;
