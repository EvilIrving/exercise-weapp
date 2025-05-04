import React, { useState, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import { libs } from "../../models/data";
import Sheet from "../Sheet";
import SearchFilter from "../SearchFilter";
import "./index.scss";

const ActionSelector = ({ onClose, onConfirm, currentSelected = [] }) =>  const [selectedActions, setSelectedActions] = useState([]);

  // 初始化已选动作
  useEffect(() => {
    setSelectedActions(
      currentSelected.map((action) => ({
        id: action.id || action.name,
        name: action.name,
        muscle: action.muscle,
        equipment: action.equipment,
        sets: action.sets, // 保留可能存在的 sets
      }))
    );
  }, [currentSelected]);

  // 选择或取消选择动作
  const toggleActionSelection = (action) => {
    const isSelected = selectedActions.some(
      (item) => item.name === action.name
    );

    if (isSelected) {
      setSelectedActions(
        selectedActions.filter((item) => item.name !== action.name)
      );
    } else {
      // 添加新动作时，确保包含必要信息，但不强制添加 sets
      setSelectedActions([
        ...selectedActions,
        {
          id: action.name, // 使用 name 作为临时 id
          name: action.name,
          muscle: action.muscle,
          equipment: action.equipment,
          // sets: action.sets, // 不在此处添加默认 sets，由 ExerciseSheet 处理
        },
      ]);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    if (selectedActions.length > 0) {
      onConfirm(selectedActions);
    }
  };

  return (
    <Sheet isOpen={true} onClose={onClose}>
      <View className="action-selector-container">
        <View className="action-selector-header">
          <Text className="action-selector-title">选择训练动作</Text>
        </View>

        {/* 渲染 SearchFilter 组件 */}
        <SearchFilter
          actionsData={libs} // 传递动作库数据
          selectedActions={selectedActions} // 传递已选动作
          onActionSelect={toggleActionSelection} // 传递选择/取消选择的回调
        />

        <View className="action-selector-footer">
          <Text className="selected-count">
            已选择 {selectedActions.length} 个动作
          </Text>
          <View className="footer-buttons">
            <Button type="default" size="mini" onClick={onClose}>
              取消
            </Button>
            <Button
              type="primary"
              size="mini"
              onClick={handleConfirm}
              disabled={selectedActions.length === 0}
            >
              确认
            </Button>
          </View>
        </View>
      </View>
    </Sheet>
  );
};

export default ActionSelector;
