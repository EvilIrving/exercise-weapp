import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView } from "@tarojs/components";

import "./index.scss";

/**
 * 全屏Sheet组件
 * @param {boolean} isOpen - 控制Sheet是否打开
 * @param {function} onClose - 关闭Sheet的回调函数
 * @param {boolean} snapToBottom - 是否在关闭时收起到底部而不是完全关闭
 * @param {React.ReactNode} children - Sheet内容
 * @param {React.ReactNode} snapContent - 收起状态时显示的内容
 */
const Sheet = ({
  isOpen,
  onClose,
  snapToBottom = false,
  children,
  snapContent,
  title = "",
}) => {
  const [state, setState] = useState("closed"); // 'closed', 'snapped', 'open'
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setState("open");
    } else if (snapToBottom && state === "open") {
      setState("snapped");
    } else {
      setState("closed");
    }
  }, [isOpen, snapToBottom]);

  const handleClose = () => {
    if (snapToBottom) {
      setState("snapped");
    } else {
      setState("closed");
    }
    onClose && onClose();
  };

  const handleOpen = () => {
    setState("open");
  };

  return (
    <View className={`sheet-container ${state !== "closed" ? "active" : ""}`}>
      {/* 背景遮罩，仅在全屏状态显示 */}
      {state === "open" && (
        <View className="sheet-overlay" onClick={handleClose} />
      )}

      {/* Sheet主体 */}
      <View className={`sheet ${state}`} ref={sheetRef}>
        {state === "open" && (
          <View className="sheet-header">
            {title && <Text className="sheet-title">{title}</Text>}
            <View className="sheet-close" onClick={handleClose}>
              ×
            </View>
          </View>
        )}

        {state === "open" && (
          <ScrollView className="sheet-content">{children}</ScrollView>
        )}

        {state === "snapped" && snapContent && (
          <View className="sheet-snap-content" onClick={handleOpen}>
            {snapContent}
          </View>
        )}
      </View>
    </View>
  );
};

export default Sheet;
