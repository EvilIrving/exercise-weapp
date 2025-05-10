import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.scss";

const Library = ({
  exercises = [],
  selectedExercises = [],
  onSelect = () => {},
}) => {
  return (
    <ScrollView
      scrollY
      enableFlex
      scrollWithAnimation
      className="library-container"
    >
      {exercises.length > 0 ? (
        <View className="actions-list">
          {exercises.map((exercise) => (
            <View
              key={exercise.name}
              className={`action-item ${
                selectedExercises.some((a) => a.name === exercise.name)
                  ? "selected"
                  : ""
              }`}
              onClick={() => onSelect(exercise)}
            >
              <View className="action-image-placeholder">
                <Text className="placeholder-text">动作图示</Text>
              </View>
              <View className="action-info">
                <Text className="action-name">{exercise.name}</Text>
                <View className="action-details">
                  <Text className="action-detail">{exercise.muscle}</Text>
                  <Text className="action-detail">{exercise.type}</Text>
                </View>
                <View className="action-details">
                  <Text className="action-detail">{exercise.equipment}</Text>
                  <Text className="action-detail">{exercise.difficulty}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="no-results">
          <Text>没有找到符合条件的动作</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Library;
