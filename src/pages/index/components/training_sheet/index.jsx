import React, { useState, useEffect, useCallback } from "react";
import Taro from "@tarojs/taro";
import { useTrainingStore, useRecordsStore } from "../../../../stores";
import timerManager from "../../../../utils/TimerManager";
import {
  View,
  Text,
  Button,
  Checkbox,
  Input,
  ScrollView,
} from "@tarojs/components";
import { Sheet } from "../../../../components/ui";
import ExerciseSelectSheet from "../exercise_select";
import { formatTime } from "../../../../utils";
import ding from "../../../../assets/ding.mp3";
import "./index.scss";

const TrainingSheet = ({ isOpen, onClose }) => {
  const [timer, setTimer] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [showSelector, setShowSelector] = useState(false);
  const { isTraining, setIsTraining } = useTrainingStore();
  const { addRecord } = useRecordsStore();

  // 初始化
  useEffect(() => {
    if (isOpen) {
      if (isTraining) {
        setShowSelector(false);
        startTimer();
      } else {
        setShowSelector(false);
        setTimer(0);
        setSelectedExercises([]);
      }
    }
  }, [isOpen, isTraining]);

  // 清理定时器
  useEffect(() => {
    return () => {
      timerManager.clearAllTimers();
    };
  }, []);

  // 开始计时
  const startTimer = useCallback(() => {
    timerManager.clearTimer("mainTimer");
    timerManager.createTimer(
      "mainTimer",
      () => {
        setTimer((prevTime) => prevTime + 1);
      },
      1000
    );
  }, []);


  // 添加动作组
  const addSet = (actionIndex) => {
    const updatedExercises = [...selectedExercises];
    const newSet = {
      weight: 15,
      reps: 12,
      group: String(updatedExercises[actionIndex].sets.length + 1),
      id: String(Date.now()),
      completed: false,
      restTimer: null,
    };
    updatedExercises[actionIndex].sets.push(newSet);
    setSelectedExercises(updatedExercises);
  };

  // 更新动作组数据
  const updateSetData = (actionIndex, setIndex, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[actionIndex].sets[setIndex][field] = value;
    setSelectedExercises(updatedExercises);
  };

  // 完成动作组，开始休息计时
  const completeSet = (actionIndex, setIndex) => {
    const updatedExercises = [...selectedExercises];
    const currentSet = updatedExercises[actionIndex].sets[setIndex];

    if (currentSet.completed) {
      // 取消完成，清除休息计时器
      currentSet.completed = false;
      currentSet.restTimer = null;
      timerManager.clearTimer(`rest_${actionIndex}_${setIndex}`);
    } else {
      // 标记为完成并启动休息计时器
      currentSet.completed = true;
      currentSet.restTimer = 90;
      const timerId = `rest_${actionIndex}_${setIndex}`;
      timerManager.createTimer(
        timerId,
        () => {
          const updated = [...selectedExercises];
          updated[actionIndex].sets[setIndex].restTimer--;
          setSelectedExercises([...updated]);
          if (updated[actionIndex].sets[setIndex].restTimer <= 0) {
            timerManager.clearTimer(timerId);
            try {
              const audio = Taro.createInnerAudioContext();
              audio.src = ding;
              audio.play();
            } catch (error) {
              console.error("播放提示音失败:", error);
            }
          }
        },
        1000
      );
    }

    setSelectedExercises(updatedExercises);
  };

  // 打开动作选择器
  const openSelector = () => {
    setShowSelector(true);
  };

  // 关闭动作选择器
  const closeSelector = () => {
    setShowSelector(false);
  };

  // 确认选择的动作
  const confirm = (actions) => {
    // 为每个新选择的动作添加默认的4组
    const actionsWithSets = actions.map((action) => {
      // 查找是否已存在于当前选中的动作中
      const existing = selectedExercises.find((a) => a.name === action.name);

      // 如果已存在且有sets，则保留
      if (existing && existing.sets) return existing;

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

    setSelectedExercises(actionsWithSets);
    closeSelector();
  };

  // 开始训练
  const startTraining = () => {
    if (selectedExercises.length === 0) {
      Taro.showToast({ title: "请先选择训练动作", icon: "none" });
      return;
    }

    setIsTraining(true);
    startTimer();
  };

  // 取消训练
  const cancelTraining = () => {
    Taro.showModal({
      title: "确认取消",
      content: "确定要取消当前训练吗？所有记录将不会保存。",
      success: function (res) {
        if (res.confirm) {
          setIsTraining(false);
          setSelectedExercises([]);
          setTimer(0);
          timerManager.clearAllTimers();
          onClose();
        }
      },
    });
  };

  // 完成训练
  const finishTraining = () => {
    // 统计每个动作的 set 数量及完成数
    let totalSets = 0,
      completedSets = 0;
    selectedExercises.forEach((action) => {
      totalSets += action.sets.length;
      completedSets += action.sets.filter((set) => set.completed).length;
    });

    if (completedSets === 0) {
      Taro.showToast({ title: "请至少完成一组动作", icon: "none" });
      return;
    }

    if (completedSets < totalSets) {
      // 弹窗提示处理未完成的组
      Taro.showModal({
        title: "还有未完成的动作组",
        content:
          "检测到部分动作未完成，请选择：\n【全部完成】将未完成的组统一标记为完成\n【移除其他】将删除未完成的组",
        confirmText: "全部完成",
        cancelText: "移除其他",
        success: (res) => {
          if (res.confirm) {
            // 全部标记为完成且取消计时
            const updatedExercises = selectedExercises.map((action) => {
              const newSets = action.sets.map((set, index) => {
                // 如 set 未完成则标记成完成，停止对应计时器
                if (!set.completed) {
                  timerManager.clearTimer(`rest_${action.id || index}`);
                  return { ...set, completed: true, restTimer: 0 };
                }
                return set;
              });
              return { ...action, sets: newSets };
            });
            // setSelectedExercises(updatedExercises);
            saveRecordAndReset(updatedExercises);
          } else if (res.cancel) {
            // 丢弃未完成的组：过滤掉未完成的 set，并移除没有完成 set 的动作
            const updatedExercises = selectedExercises
              .map((action) => ({
                ...action,
                sets: action.sets.filter((set) => set.completed),
              }))
              .filter((action) => action.sets.length > 0);


              console.log("updatedExercises", updatedExercises);
            // setSelectedExercises(updatedExercises);
            saveRecordAndReset(updatedExercises);
          }
        },
      });
      return;
    }

    // 若全部 set 均已完成
    saveRecordAndReset(selectedExercises);
  };

  const saveRecordAndReset = (completed) => {
    const record = {
      id: String(Date.now()),
      exerciseName: "未命名训练",
      date: new Date().toISOString().split("T")[0],
      exercises: completed.map((action) => ({
        id: action.id || String(Math.random()),
        name: action.name,
        sets: action.sets.map((set) => ({
          weight: set.weight,
          reps: set.reps,
        })),
      })),
    };

    addRecord(record);
    setIsTraining(false);
    Taro.showToast({ title: "训练记录已保存", icon: "success" });
    setSelectedExercises([]);
    setTimer(0);
    timerManager.clearAllTimers();
    onClose();
  };

  /** Sheet 相关逻辑 */

  // 处理Sheet关闭
  const handleSheetClose = () => {
    // 如果正在训练，只允许收起，不允许完全关闭
    if (isTraining) {
      // 返回 false，Sheet 组件会根据 snapToBottom 只收起不关闭
      return false;
    }
    // 未在训练时允许关闭
    onClose();
    return true;
  };

  // 渲染收起状态的内容
  const renderSnapContent = () => {
    if (!isTraining) return null;
    const totalSets = selectedExercises.reduce(
      (total, action) => total + action.sets.length,
      0
    );
    const completedSets = selectedExercises.reduce(
      (total, action) =>
        total + action.sets.filter((set) => set.completed).length,
      0
    );
    return (
      <View className="training-status-bar">
        <View className="training-icon">🏋️</View>
        <View className="training-info">
          <Text className="training-title">训练进行中</Text>
          <Text className="training-time">
            {formatTime(timer)} | {completedSets}/{totalSets} 组
          </Text>
        </View>
        <View className="training-actions">
          <Button type="primary" size="mini" onClick={finishTraining}>
            完成
          </Button>
        </View>
      </View>
    );
  };

  const renderEmptyContent = () => {
    return (
      <View className="empty-container">
        <Text className="empty-text">请选择训练动作开始训练</Text>
        <Button type="primary" size="mini" onClick={openSelector}>
          选择动作
        </Button>
      </View>
    );
  };

  const renderExcecisesContent = () => {
    return (
      <ScrollView
        scrollY
        enableFlex
        scrollWithAnimation
        className="scroll-container"
      >
        {selectedExercises.map((action, actionIndex) => (
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
                      {String(set.restTimer % 60).padStart(2, "0")}
                    </Text>
                  )}
                </View>
              ))}
              <Button
                className="add-set-btn"
                size="mini"
                onClick={() => addSet(actionIndex)}
              >
                添加组
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderFooterContent = () => {
    return (
      <View className="exercise-footer">
        {isTraining ? (
          <>
            <Button type="warn" size="mini" onClick={cancelTraining}>
              取消训练
            </Button>
            <Button type="primary" size="mini" onClick={finishTraining}>
              完成训练
            </Button>
            <Button type="default" size="mini" onClick={openSelector}>
              添加动作
            </Button>
          </>
        ) : (
          <Button type="primary" size="mini" onClick={startTraining}>
            开始训练
          </Button>
        )}
      </View>
    );
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleSheetClose}
      snapToBottom={isTraining}
      snapContent={renderSnapContent()}
      title="训练"
    >
      <View className="exercise-sheet">
        <View className="exercise-header">
          <Text className="exercise-timer">{formatTime(timer)}</Text>
        </View>
        <View className="exercise-container">
          {selectedExercises.length === 0
            ? renderEmptyContent()
            : renderExcecisesContent()}
        </View>

        {renderFooterContent()}
      </View>

      <ExerciseSelectSheet
        isOpen={showSelector}
        onClose={closeSelector}
        onConfirm={confirm}
        currentSelected={selectedExercises}
      />
    </Sheet>
  );
};

export default TrainingSheet;
