import React, { useCallback } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";

import "./index.scss";

const Index = () => {
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

  const goToExcercise = useCallback(() => {
    Taro.navigateTo({
      url: "/pages/exercise/index",
    });
  }, []);

  return (
    <View className="index-page">
      <View className="header">
        <Text className="title">训记</Text>
        <Text className="subtitle">记录每一次的训练进步</Text>
      </View>

      <View className="date-card">
        <Text className="date-text">今天是 {dateStr}</Text>
        {recentRecords.length > 0 ? (
          <Text className="training-count">
            已完成 {recentRecords.length} 次训练
          </Text>
        ) : (
          <Text className="training-count">今天还没有训练记录</Text>
        )}
      </View>

      <View className="action-card">
        <Button className="start-btn" onClick={() => goToExcercise()}>
          开始训练
        </Button>
      </View>

      {recentRecords.length > 0 && (
        <View className="recent-records">
          <Text className="section-title">最近训练记录</Text>
          <View className="record-lists">
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
          </View>
        </View>
      )}
    </View>
  );
};

export default Index;
