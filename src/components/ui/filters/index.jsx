import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.scss";

const Filters = ({
  muscles = [],
  equipments = [],
  selectedMuscle = "",
  selectedEquipment = "",
  onMuscleFilter,
  onEquipmentFilter,
}) => {
  return (
    <View className="filter-section">
      <View className="filter-group">
        <Text className="filter-title">肌肉部位</Text>
        <ScrollView className="filter-scroll" scrollX>
          <View className="filter-options">
            {muscles.map((muscle) => (
              <Text
                key={muscle}
                className={`filter-option ${
                  selectedMuscle === muscle ? "active" : ""
                }`}
                onClick={() => onMuscleFilter(muscle)}
              >
                {muscle}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="filter-group">
        <Text className="filter-title">训练设备</Text>
        <ScrollView className="filter-scroll" scrollX>
          <View className="filter-options">
            {equipments.map((equipment) => (
              <Text
                key={equipment}
                className={`filter-option ${
                  selectedEquipment === equipment ? "active" : ""
                }`}
                onClick={() => onEquipmentFilter(equipment)}
              >
                {equipment}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Filters;
