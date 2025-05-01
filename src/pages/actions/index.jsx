import React, { useState, useEffect } from "react";
import { View, Text, Input, ScrollView } from "@tarojs/components";
import { libs } from "../../models/data";
import "./index.scss";

const Actions = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [filteredActions, setFilteredActions] = useState([]);

  // 获取所有可用的肌肉部位和设备类型（去重）
  const muscles = [...new Set(libs.map((item) => item.muscle))];
  const equipments = [...new Set(libs.map((item) => item.equipment))];

  // 根据筛选条件过滤动作
  useEffect(() => {
    let result = [...libs];

    // 按名称搜索
    if (searchText) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 按肌肉部位筛选
    if (selectedMuscle) {
      result = result.filter((item) => item.muscle === selectedMuscle);
    }

    // 按设备筛选
    if (selectedEquipment) {
      result = result.filter((item) => item.equipment === selectedEquipment);
    }

    setFilteredActions(result);
  }, [searchText, selectedMuscle, selectedEquipment]);

  // 处理搜索输入
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  // 处理肌肉部位筛选
  const handleMuscleFilter = (muscle) => {
    setSelectedMuscle(selectedMuscle === muscle ? "" : muscle);
  };

  // 处理设备筛选
  const handleEquipmentFilter = (equipment) => {
    setSelectedEquipment(selectedEquipment === equipment ? "" : equipment);
  };

  return (
    <View className="actions-page">
      <View className="search-section">
        <Input
          className="search-input"
          type="text"
          placeholder="搜索动作名称"
          value={searchText}
          onInput={handleSearchInput}
        />
      </View>

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
                  onClick={() => handleMuscleFilter(muscle)}
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
                  onClick={() => handleEquipmentFilter(equipment)}
                >
                  {equipment}
                </Text>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <View className="actions-list">
        {filteredActions.length > 0 ? (
          filteredActions.map((action) => (
            <View key={action.name} className="action-item">
              <View className="action-image-placeholder">
                {/* 预留动图展示位置 */}
                <Text className="placeholder-text">动作图示</Text>
              </View>
              <View className="action-info">
                <Text className="action-name">{action.name}</Text>
                <View className="action-details">
                  <Text className="action-detail">肌肉: {action.muscle}</Text>
                  <Text className="action-detail">类型: {action.type}</Text>
                  <Text className="action-detail">
                    设备: {action.equipment}
                  </Text>
                  <Text className="action-detail">
                    难度: {action.difficulty}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="no-results">
            <Text>没有找到符合条件的动作</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Actions;
