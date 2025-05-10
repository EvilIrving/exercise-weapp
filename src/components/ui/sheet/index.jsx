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

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  const handleTouchScroll = (flag) => {
    // if (process.env.TARO_ENV !== 'h5') {
    //   return;
    // }

    let scrollTop = 0;

    if (flag) {
      scrollTop = document.documentElement.scrollTop;

      // Make body leave document flow
      document.body.classList.add("at-frozen");

      // Pull the body up to prevent page jumping to top
      document.body.style.top = `${-scrollTop}px`;
    } else {
      document.body.style.top = "";
      document.body.classList.remove("at-frozen");

      document.documentElement.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    handleTouchScroll(isOpen);
  }, [isOpen]);

  return (
    <View
      className={`sheet-container ${state !== "closed" ? "active" : ""}`}
      onTouchMove={handleTouchMove}
    >
      {/* 背景遮罩，仅在全屏状态显示 */}
      {state === "open" && (
        <View className="sheet-overlay" onClick={handleClose} />
      )}

      {/* Sheet主体 */}
      <View className={`sheet ${state}`} ref={sheetRef}>
        {state === "open" && (
          <View className="sheet-header">
            {title && <Text className="sheet-title">{title}</Text>}
            <View className="sheet-close" onClick={handleClose}></View>
          </View>
        )}

        {state === "open" && (
          <View

            className="sheet-content"
          >
            {children}
          </View>
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
