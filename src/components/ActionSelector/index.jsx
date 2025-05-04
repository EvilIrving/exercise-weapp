import React, { useState, useEffect } from "react";
import { View, Text, Input, ScrollView, Button } from "@tarojs/components";
import { libs } from "../../models/data";
import "./index.scss";

const ActionSelector = ({ onClose, onConfirm, currentSelected = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedActions, setSelectedActions] = useState([]);

  // 保持currentSelected与selectedActions同步，新增动作后也能选中
  useEffect(() => {
    setSelectedActions(currentSelected.map(action => ({ ...action })));
  }, [currentSelected]);
  const [filteredActions, setFilteredActions] = useState([]);

  // 获取所有可用的肌肉部位和设备类型（去重）
  const muscles = [...new Set(libs.map((item) => item.muscle))];
  const equipments = [...new Set(libs.map((item) => item.equipment))];

  // 初始化已选动作
  useEffect(() => {
    setSelectedActions(currentSelected.map(action => ({
      id: action.id || action.name,
      name: action.name,
      muscle: action.muscle,
      equipment: action.equipment,
      sets: action.sets
    })));
  }, [currentSelected]);

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

  // 选择或取消选择动作
  const toggleActionSelection = (action) => {
    const isSelected = selectedActions.some(item => item.name === action.name);

    if (isSelected) {
      setSelectedActions(selectedActions.filter(item => item.name !== action.name));
    } else {
      setSelectedActions([...selectedActions, {
        id: action.name,
        name: action.name,
        muscle: action.muscle,
        equipment: action.equipment
      }]);
    }
  };

  // 新增动作时自动选中并同步状态
  const handleAddAction = (action) => {
    setSelectedActions(prev => {
      if (!prev.some(item => item.name === action.name)) {
        return [...prev, { ...action }];
      }
      return prev;
    });
  };

  // 确认选择
  const handleConfirm = () => {
    if (selectedActions.length > 0) {
      onConfirm(selectedActions);
    }
  };

  return (
    <View className="action-selector-overlay">
      <View className="action-selector-container">
        <View className="action-selector-header">
          <Text className="action-selector-title">选择训练动作</Text>
          <Text className="action-selector-close" onClick={onClose}>×</Text>
        </View>

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
                    className={`filter-option ${selectedMuscle === muscle ? "active" : ""}`}
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
                    className={`filter-option ${selectedEquipment === equipment ? "active" : ""}`}
                    onClick={() => handleEquipmentFilter(equipment)}
                  >
                    {equipment}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <ScrollView className="actions-list" scrollY>
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => {
              const isSelected = selectedActions.some(item => item.name === action.name);
              return (
                <View
                  key={action.name}
                  className={`action-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleActionSelection(action)}
                >
                  <View className="action-info">
                    <Text className="action-name">{action.name}</Text>
                    <View className="action-details">
                      <Text className="action-detail">肌肉: {action.muscle}</Text>
                      <Text className="action-detail">设备: {action.equipment}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View className="action-selected-indicator">✓</View>
                  )}
                </View>
              );
            })
          ) : (
            <View className="no-results">
              <Text>没有找到符合条件的动作</Text>
            </View>
          )}
        </ScrollView>

        <View className="action-selector-footer">
          <Text className="selected-count">已选择 {selectedActions.length} 个动作</Text>
          <View className="footer-buttons">
            <Button className="cancel-btn" onClick={onClose}>取消</Button>
            <Button
              className={`confirm-btn ${selectedActions.length === 0 ? 'disabled' : ''}`}
              onClick={handleConfirm}
              disabled={selectedActions.length === 0}
            >
              确认
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActionSelector;
