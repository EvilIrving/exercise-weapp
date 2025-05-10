import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";
/**
 * Fab 组件，使用 React 18 函数组件语法
 * props:
 * - size: 'normal' | 'small'
 * - className: string
 * - onClick: function
 * - children: ReactNode
 */
const Fab = ({
  size = "normal",
  className = "",
  onClick,
  children,
  ...restProps
}) => {
  // 动态拼接类名
  const rootClass = `at-fab ${className} ${
    size ? `at-fab--${size}` : ""
  }`.trim();

  return (
    <View className={rootClass} onClick={onClick} {...restProps}>
      {children}
    </View>
  );
};

export default Fab;
