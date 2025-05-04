import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

const Card = ({ children, onClick, className = "" }) => {
  return (
    <View
      className={`card ${className}`}
      onClick={onClick}
    >
      {children}
    </View>
  );
};

export default Card;
