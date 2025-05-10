import React, { useCallback } from "react";
import { useTrainingStore, useRecordsStore } from "../../stores";
import { View, Text, Button } from "@tarojs/components";
import { Card } from "../../components/ui";
import { Records, TrainingSheet } from "./components";
import "./index.scss";

const Index = () => {
  const [showExerciseSheet, setShowExerciseSheet] = React.useState(false);
  const { isTraining } = useTrainingStore();
  const { records, getRecordsByDate } = useRecordsStore();
  const todayRecords = getRecordsByDate(new Date().toISOString().split("T")[0]);

  // 打开训练Sheet
  const openExerciseSheet = useCallback(() => {
    setShowExerciseSheet(true);
  }, []);

  // 关闭训练Sheet
  const closeExerciseSheet = useCallback(() => {
    setShowExerciseSheet(false);
  }, []);

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

      <Card>
        <Text className="date-text">今天是 {dateStr}</Text>
        {records.length > 0 ? (
          <Text className="training-count">
            已完成 {todayRecords.length} 次训练
          </Text>
        ) : (
          <Text className="training-count">今天还没有训练记录</Text>
        )}
      </Card>

      <Card>
        <Button type="primary" size="mini" onClick={openExerciseSheet}>
          {isTraining ? "继续训练" : "去训练"}
        </Button>
      </Card>

      {records.length > 0 && <Records records={records} />}

      <TrainingSheet isOpen={showExerciseSheet} onClose={closeExerciseSheet} />
    </View>
  );
};

export default Index;
