import React, { useCallback, useState, useEffect } from "react";
import { View, Text, Button, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ExerciseSheet from "../../components/ExerciseSheet";
import Card from "../../components/Card";

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

  const recentRecords = [
    {
      id: "record1",
      date: "2023-05-01",
      exerciseName: "平板卧推",
      sets: [
        {
          weight: 135, // 重量
          reps: 10, // 次数
          group: "1", // 组数
          id: "1",
        },
        {
          weight: 135,
          reps: 10,
          group: "2",
          id: "2",
        },
        {
          weight: 135,
          reps: 10,
          group: "3",
          id: "3",
        },
        {
          weight: 135,
          reps: 10,
          group: "4",
          id: "4",
        },
      ],
    },
    {
      id: "record2",
      date: "2023-05-01",
      exerciseName: "引体向上",
      sets: [
        {
          weight: 135, // 重量
          reps: 10, // 次数
          group: "1", // 组数
          id: "1",
        },
        {
          weight: 135,
          reps: 10,
          group: "2",
          id: "2",
        },
        {
          weight: 135,
          reps: 10,
          group: "3",
          id: "3",
        },
        {
          weight: 135,
          reps: 10,
          group: "4",
          id: "4",
        },
      ],
    },
    {
      id: "record2",
      date: "2023-05-01",
      exerciseName: "qita",
      sets: [
        {
          weight: 135, // 重量
          reps: 10, // 次数
          group: "1", // 组数
          id: "1",
        },
        {
          weight: 135,
          reps: 10,
          group: "2",
          id: "2",
        },
        {
          weight: 135,
          reps: 10,
          group: "3",
          id: "3",
        },
        {
          weight: 135,
          reps: 10,
          group: "4",
          id: "4",
        },
      ],
    },
    {
      id: "record5",
      date: "2023-05-01",
      exerciseName: "上斜卧推上",
      sets: [
        {
          weight: 135, // 重量
          reps: 10, // 次数
          group: "1", // 组数
          id: "1",
        },
        {
          weight: 135,
          reps: 10,
          group: "2",
          id: "2",
        },
        {
          weight: 135,
          reps: 10,
          group: "3",
          id: "3",
        },
        {
          weight: 135,
          reps: 10,
          group: "4",
          id: "4",
        },
      ],
    },
    {
      id: "record4",
      date: "2023-05-01",
      exerciseName: "手臂弯矩",
      sets: [
        {
          weight: 135, // 重量
          reps: 10, // 次数
          group: "1", // 组数
          id: "1",
        },
        {
          weight: 135,
          reps: 10,
          group: "2",
          id: "2",
        },
        {
          weight: 135,
          reps: 10,
          group: "3",
          id: "3",
        },
        {
          weight: 135,
          reps: 10,
          group: "4",
          id: "4",
        },
      ],
    },
  ];

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

      {recentRecords.length > 0 && (
        <ScrollView>
          <Text className="section-title">最近训练记录</Text>
          <Card>
            {recentRecords.map((record) => (
              <View key={record.id} className="record-item">
                <View className="record-info">
                  <Text className="record-name">{record.exerciseName}</Text>
                  <Text className="record-date">
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
                <View className="record-list">
                  {record.sets.map((set) => (
                    <Text>
                      {set.reps} 次 x {set.weight} kg
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </Card>
        </ScrollView>
      )}
      {/* 训练Sheet组件 */}
      <ExerciseSheet isOpen={showExerciseSheet} onClose={closeExerciseSheet} />
    </View>
  );
};

export default Index;
