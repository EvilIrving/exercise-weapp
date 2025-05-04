import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, Checkbox, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Sheet from "../Sheet";
import ActionSelector from "../ActionSelector";
import "./index.scss";

const ExerciseSheet = ({ isOpen, onClose }) => {
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [selectedActions, setSelectedActions] = useState([]);
  const [showActionSelector, setShowActionSelector] = useState(false);
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [sheetState, setSheetState] = useState("closed"); // closed, snapped, open

  // 初始化
  useEffect(() => {
    if (isOpen) {
      // 检查是否有进行中的训练
      const ongoingTraining = Taro.getStorageSync("ongoingTraining");
      if (ongoingTraining) {
        setSelectedActions(ongoingTraining.actions || []);
        setTimer(ongoingTraining.timer || 0);
        setIsTrainingStarted(true);
        startTimer();
      } else {
        setShowActionSelector(false);
      }
      setSheetState("open");
    }
  }, [isOpen]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // 开始计时
  const startTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        const newTime = prevTime + 1;
        // 更新存储中的训练状态
        if (isTrainingStarted) {
          const ongoingTraining = Taro.getStorageSync("ongoingTraining") || {};
          Taro.setStorageSync("ongoingTraining", {
            ...ongoingTraining,
            timer: newTime,
          });
        }
        return newTime;
      });
    }, 1000);
    setTimerInterval(interval);
  }, [timerInterval, isTrainingStarted]);

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 添加动作组
  const addSet = (actionIndex) => {
    const updatedActions = [...selectedActions];
    const newSet = {
      weight: 15,
      reps: 12,
      group: String(updatedActions[actionIndex].sets.length + 1),
      id: String(Date.now()),
      completed: false,
      restTimer: null,
    };
    updatedActions[actionIndex].sets.push(newSet);
    setSelectedActions(updatedActions);

    // 更新存储
    if (isTrainingStarted) {
      const ongoingTraining = Taro.getStorageSync("ongoingTraining") || {};
      Taro.setStorageSync("ongoingTraining", {
        ...ongoingTraining,
        actions: updatedActions,
      });
    }
  };

  // 更新动作组数据
  const updateSetData = (actionIndex, setIndex, field, value) => {
    const updatedActions = [...selectedActions];
    updatedActions[actionIndex].sets[setIndex][field] = value;
    setSelectedActions(updatedActions);

    // 更新存储
    if (isTrainingStarted) {
      const ongoingTraining = Taro.getStorageSync("ongoingTraining") || {};
      Taro.setStorageSync("ongoingTraining", {
        ...ongoingTraining,
        actions: updatedActions,
      });
    }
  };

  // 完成动作组，开始休息计时
  const completeSet = (actionIndex, setIndex) => {
    const updatedActions = [...selectedActions];
    const currentSet = updatedActions[actionIndex].sets[setIndex];
    currentSet.completed = !currentSet.completed;

    // 如果标记为完成，开始休息计时
    if (currentSet.completed) {
      currentSet.restTimer = 90; // 90秒休息时间
      const restInterval = setInterval(() => {
        updatedActions[actionIndex].sets[setIndex].restTimer--;
        setSelectedActions([...updatedActions]);

        // 休息时间结束
        if (updatedActions[actionIndex].sets[setIndex].restTimer <= 0) {
          clearInterval(restInterval);
          // 播放提示音
          try {
            const audio = Taro.createInnerAudioContext();
            audio.src = "https://example.com/ding.mp3"; // 需要替换为实际的提示音文件
            audio.play();
          } catch (error) {
            console.error("播放提示音失败:", error);
          }
        }
      }, 1000);
    }

    setSelectedActions(updatedActions);

    // 更新存储
    if (isTrainingStarted) {
      const ongoingTraining = Taro.getStorageSync("ongoingTraining") || {};
      Taro.setStorageSync("ongoingTraining", {
        ...ongoingTraining,
        actions: updatedActions,
      });
    }
  };

  // 打开动作选择器
  const openActionSelector = () => {
    setShowActionSelector(true);
  };

  // 关闭动作选择器
  const closeActionSelector = () => {
    setShowActionSelector(false);
  };

  // 确认选择的动作
  const confirmSelectedActions = (actions) => {
    // 为每个新选择的动作添加默认的4组
    const actionsWithSets = actions.map((action) => {
      // 查找是否已存在于当前选中的动作中
      const existingAction = selectedActions.find(
        (a) => a.name === action.name
      );

      // 如果已存在且有sets，则保留
      if (existingAction && existingAction.sets) return existingAction;

      // 如果已经有sets，则保留
      if (action.sets) return action;

      // 否则添加默认的4组
      return {
        ...action,
        sets: Array(4)
          .fill(0)
          .map((_, index) => ({
            weight: 15,
            reps: 12,
            group: String(index + 1),
            id: String(Date.now() + index),
            completed: false,
          })),
      };
    });

    setSelectedActions(actionsWithSets);
    closeActionSelector();
  };

  // 开始训练
  const startTraining = () => {
    setIsTrainingStarted(true);
    startTimer();

    // 保存训练状态
    Taro.setStorageSync("ongoingTraining", {
      actions: selectedActions,
      timer: timer,
      startTime: new Date().toISOString(),
    });

    // 通知其他组件训练状态变化
    Taro.eventCenter.trigger("trainingStatusChange");
  };

  // 取消训练
  const cancelTraining = () => {
    Taro.showModal({
      title: "确认取消",
      content: "确定要取消当前训练吗？所有记录将不会保存。",
      success: function (res) {
        if (res.confirm) {
          Taro.removeStorageSync("ongoingTraining");
          Taro.eventCenter.trigger("trainingStatusChange");
          setSelectedActions([]);
          setTimer(0);
          setIsTrainingStarted(false);
          if (timerInterval) clearInterval(timerInterval);
          onClose();
        }
      },
    });
  };

  // 完成训练
  const finishTraining = () => {
    if (selectedActions.length === 0) {
      Taro.showToast({ title: "请先选择并完成训练动作", icon: "none" });
      return;
    }

    // 整理保存的数据结构
    const record = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      actions: selectedActions.map((action) => ({
        name: action.name,
        type: action.type,
        muscle: action.muscle,
        equipment: action.equipment,
        sets: action.sets.map((set) => ({
          weight: set.weight,
          reps: set.reps,
          group: set.group,
          completed: set.completed,
        })),
      })),
    };

    // 读取已有记录
    let records = Taro.getStorageSync("trainingRecords") || [];
    if (!Array.isArray(records)) records = [];
    records.unshift(record);
    Taro.setStorageSync("trainingRecords", records);
    Taro.removeStorageSync("ongoingTraining");
    Taro.eventCenter.trigger("trainingStatusChange");
    Taro.showToast({ title: "训练记录已保存", icon: "success" });

    // 重置状态
    setSelectedActions([]);
    setTimer(0);
    setIsTrainingStarted(false);
    if (timerInterval) clearInterval(timerInterval);
    onClose();
  };

  // 处理Sheet关闭
  const handleSheetClose = () => {
    if (isTrainingStarted) {
      // 如果正在训练，则收起而不是关闭
      return false;
    } else {
      // 如果没有开始训练，则可以完全关闭
      onClose();
      return true;
    }
  };

  // 渲染收起状态的内容
  const renderSnapContent = () => {
    if (!isTrainingStarted) return null;

    // 计算已完成的组数
    const totalSets = selectedActions.reduce((total, action) =>
      total + action.sets.length, 0);
    const completedSets = selectedActions.reduce((total, action) =>
      total + action.sets.filter(set => set.completed).length, 0);

    return (
      <View className="training-status-bar">
        <View className="training-icon">🏋️</View>
        <View className="training-info">
          <Text className="training-title">训练进行中</Text>
          <Text className="training-time">{formatTime(timer)} | {completedSets}/{totalSets} 组</Text>
        </View>
        <View className="training-actions">
          <Button className="training-action-btn" size="mini" onClick={finishTraining}>完成</Button>
        </View>
      </View>
    );
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleSheetClose}
      snapToBottom={isTrainingStarted}
      snapContent={renderSnapContent()}
      title="训练"
    >
      <View className="exercise-sheet">
        <View className="exercise-header">
          <Text className="exercise-timer">{formatTime(timer)}</Text>
        </View>

        {selectedActions.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">请选择训练动作开始训练</Text>
            <Button className="select-action-btn" onClick={openActionSelector}>
              选择动作
            </Button>
          </View>
        ) : (
          <View className="actions-container">
            {selectedActions.map((action, actionIndex) => (
              <View key={action.id || actionIndex} className="action-card">
                <View className="action-header">
                  <Text className="action-name">{action.name}</Text>
                </View>

                <View className="sets-container">
                  {action.sets.map((set, setIndex) => (
                    <View key={set.id} className="set-row">
                      <Checkbox
                        className="set-checkbox"
                        checked={set.completed}
                        onClick={() => completeSet(actionIndex, setIndex)}
                      />
                      <Text className="set-group">组 {set.group}</Text>
                      <Input
                        className="set-input"
                        type="number"
                        value={String(set.reps)}
                        onInput={(e) =>
                          updateSetData(
                            actionIndex,
                            setIndex,
                            "reps",
                            parseInt(e.detail.value)
                          )
                        }
                      />
                      <Text className="set-label">次</Text>
                      <Input
                        className="set-input"
                        type="digit"
                        value={String(set.weight)}
                        onInput={(e) =>
                          updateSetData(
                            actionIndex,
                            setIndex,
                            "weight",
                            parseFloat(e.detail.value)
                          )
                        }
                      />
                      <Text className="set-label">kg</Text>

                      {set.restTimer > 0 && (
                        <Text className="rest-timer">
                          休息: {Math.floor(set.restTimer / 60)}:
                          {(set.restTimer % 60).toString().padStart(2, "0")}
                        </Text>
                      )}
                    </View>
                  ))}
                  <Button
                    className="add-set-btn"
                    onClick={() => addSet(actionIndex)}
                  >
                    增加一组
                  </Button>
                </View>
              </View>
            ))}

            <View className="action-buttons">
              <Button className="add-action-btn" onClick={openActionSelector}>
                增加运动
              </Button>

              {!isTrainingStarted ? (
                <Button className="start-btn" onClick={startTraining}>
                  开始训练
                </Button>
              ) : (
                <>
                  <Button className="cancel-btn" onClick={cancelTraining}>
                    取消训练
                  </Button>
                  <Button className="finish-btn" onClick={finishTraining}>
                    完成训练
                  </Button>
                </>
              )}
            </View>
          </View>
        )}

        {showActionSelector && (
          <ActionSelector
            onClose={closeActionSelector}
            onConfirm={confirmSelectedActions}
            currentSelected={selectedActions}
          />
        )}
      </View>
    </Sheet>
  );
};

export default ExerciseSheet;
