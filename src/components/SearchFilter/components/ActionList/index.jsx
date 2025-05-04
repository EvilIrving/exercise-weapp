import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.scss";

const ActionList = ({ actions = [], selectedActions = [], onActionSelect }) => {
  const handleActionClick = (action) => {
    onActionSelect(action);
  };

  return (
    <ScrollView
      scrollY
      style={{ height: '90vh' }}
      enhanced
      showScrollbar
      onTouchMove={(e) => e.stopPropagation()}
    >
      {actions.length > 0 ? (
        <View className="actions-list">
          {actions.map((action) => (
            <View
              key={action.name}
              className={`action-item ${selectedActions.some(a => a.name === action.name) ? 'selected' : ''}`}
              onClick={() => handleActionClick(action)}
            >
              <View className="action-image-placeholder">
                <Text className="placeholder-text">动作图示</Text>
              </View>
              <View className="action-info">
                <Text className="action-name">{action.name}</Text>
                <View className="action-details">
                  <Text className="action-detail">{action.muscle}</Text>
                  <Text className="action-detail">{action.type}</Text>
                </View>
                <View className="action-details">
                  <Text className="action-detail">{action.equipment}</Text>
                  <Text className="action-detail">{action.difficulty}</Text>
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

export default ActionList;
