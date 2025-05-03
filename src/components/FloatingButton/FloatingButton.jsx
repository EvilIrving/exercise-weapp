import React, { useEffect, useState } from "react";
import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./FloatingButton.scss";

const FloatingButton = () => {
  const [hasOngoingTraining, setHasOngoingTraining] = useState(false);

  useEffect(() => {
    const checkTraining = () => {
      const ongoing = Taro.getStorageSync("ongoingTraining");
      setHasOngoingTraining(!!ongoing);
    };
    checkTraining();
    Taro.eventCenter.on("trainingStatusChange", checkTraining);
    return () => {
      Taro.eventCenter.off("trainingStatusChange", checkTraining);
    };
  }, []);

  const onResumeTraining = () => {
    Taro.navigateTo({ url: "/pages/exercise/index" });
  };

  if (!hasOngoingTraining) return null;

  return (
    <View className="floating-btn">
      <Button onClick={onResumeTraining}>继续训练</Button>
    </View>
  );
};

export default FloatingButton;
