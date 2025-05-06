import React, { useCallback, useState, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import RecordsList from "../../components/RecordsList";
import ExerciseSheet from "../../components/ExerciseSheet";
import Card from "../../components/Card";
import { useTrainingStore, useRecordsStore } from "./store";

import "./index.scss";

const Index = () => {
  const [hasOngoingTraining, setHasOngoingTraining] = useState(false);
  const [showExerciseSheet, setShowExerciseSheet] = useState(false);

  // 检查是否有进行中的训练
  useEffect(() => {
    const ongoingTraining = Taro.getStorageSync("ongoingTraining");
    setHasOngoingTraining(!!ongoingTraining);

    // 监听训练状态变化
    Taro.eventCenter.on("trainingStatusChange", () => {
      const training = Taro.getStorageSync("ongoingTraining");
      setHasOngoingTraining(!!training);
    });

    return () => {
      Taro.eventCenter.off("trainingStatusChange");
    };
  }, []);

  // 打开训练Sheet
  const openExerciseSheet = useCallback(() => {
    setShowExerciseSheet(true);
  }, []);

  // 关闭训练Sheet
  const closeExerciseSheet = useCallback(() => {
    setShowExerciseSheet(false);
  }, []);

  const { currentTraining, startTraining } = useTrainingStore();
  const { records } = useRecordsStore();

  // 获取今天的日期
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日`;

  return (
    <View className="index-page">
      <View className="header">
        <Text className="title">训记</Text>
        <Text className="subtitle">记录每一次的训练进步</Text>
      </View>

      <Card onClick={() => console.log("日期卡片被点击")}>
        <Text className="date-text">今天是 {dateStr}</Text>
        {recentRecords.length > 0 ? (
          <Text className="training-count">
            已完成 {recentRecords.length} 次训练
          </Text>
        ) : (
          <Text className="training-count">今天还没有训练记录</Text>
        )}
      </Card>

      <Card>
        <Button type="primary" size="mini" onClick={openExerciseSheet}>
          开始训练
        </Button>
      </Card>

      {records.length > 0 && <RecordsList records={records} />}

      <ExerciseSheet isOpen={showExerciseSheet} onClose={closeExerciseSheet} />
    </View>
  );
};

export default Index;
