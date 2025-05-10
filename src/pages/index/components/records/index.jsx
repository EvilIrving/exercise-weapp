import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Card from "../../../../components/ui/card";
import "./index.scss";
const Records = ({ records }) => {
  return (
    <ScrollView
      scrollY
      enableFlex
      scrollWithAnimation
      className="records-container"
    >
      <Text className="section-title">最近训练记录</Text>
      <View>
        {records.map((record) => (
          <View key={record.id} className="record-item">
            <View className="record-info">
              <Text className="record-name">{record.exerciseName}</Text>
              <Text className="record-date">
                {/* {new Date(record.date).toLocaleDateString()} */}
                {record.date}
              </Text>
            </View>
            <View className="record-list">
              {record.exercises.map((exercise) => (
                <View key={exercise.id} className="record-set">
                  <Text className="record-set__name">{exercise.name}</Text>
                  {exercise.sets.map((set, index) => (
                    <View key={index}>
                      {set.reps} 次 x {set.weight} kg
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Records;
