import React, { useState, useEffect } from "react";
import { View, Icon } from "@tarojs/components";

import {
  Input,
  Filters,
  Library,
  Card,
  Fab,
  Sheet,
} from "../../../../components/ui";
import { libs } from "../../../../models/data";
import "./index.scss";

/**
 *
 *  组件支持选择动作,确认动作
 */
const ExerciseSelector = ({
  isOpen,
  onClose,
  onConfirm,
  currentSelected = [],
}) => {
  const [filteredExercises, setFilteredExercises] = useState([]);
  // 提取唯一的肌肉和设备列表
  const uniqueMuscles = [...new Set(libs.map((action) => action.muscle))];
  const uniqueEquipments = [...new Set(libs.map((action) => action.equipment))];

  // 处理搜索输入
  const [searchText, setSearchText] = useState("");
  const handleSearchInput = (e) => {
    setSearchText(e.detail.value);
  };

  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");

  // 处理肌肉过滤
  const handleMuscleFilter = (muscle) => {
    setSelectedMuscle(muscle === selectedMuscle ? "" : muscle);
  };

  // 处理设备过滤
  const handleEquipmentFilter = (equipment) => {
    setSelectedEquipment(equipment === selectedEquipment ? "" : equipment);
  };

  // 过滤动作
  useEffect(() => {
    let results = libs;

    // 根据搜索词过滤
    if (searchText) {
      results = results.filter((action) =>
        action.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 根据肌肉部位过滤
    if (selectedMuscle && selectedMuscle !== "全部") {
      results = results.filter((action) => action.muscle === selectedMuscle);
    }

    // 根据设备过滤
    if (selectedEquipment && selectedEquipment !== "全部") {
      results = results.filter(
        (action) => action.equipment === selectedEquipment
      );
    }

    setFilteredExercises(results);
  }, [searchText, selectedMuscle, selectedEquipment, libs]);

  const [selected, setSelected] = useState([]);
  // 初始化已选动作
  useEffect(() => {
    setSelected(
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
  const onSelect = (action) => {
    const isSelected = selected.some((item) => item.name === action.name);

    if (isSelected) {
      setSelected(selected.filter((item) => item.name !== action.name));
    } else {
      // 添加新动作时，确保包含必要信息，但不强制添加 sets
      setSelected([
        ...selected,
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
    if (selected.length > 0) {
      onConfirm(selected);
    }
  };

  const handleSheetClose = () => {
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleSheetClose}
      snapToBottom={false}
      title="选择动作"
    >
      <View className="select-container">
        <Card>
          {/*   输入框 */}
          <Input
            searchText={searchText}
            onSearchChange={handleSearchInput}
          ></Input>
          {/* 筛选栏 */}
          <Filters
            muscles={uniqueMuscles}
            equipments={uniqueEquipments}
            selectedMuscle={selectedMuscle}
            selectedEquipment={selectedEquipment}
            onMuscleFilter={handleMuscleFilter}
            onEquipmentFilter={handleEquipmentFilter}
          />
        </Card>

        {/* 动作列表 */}
        <Library
          exercises={filteredExercises}
          selectedExercises={selected} // 传递已选动作
          onSelect={onSelect} // 传递选择回调
        />

        {/* 悬浮确认按钮 */}

        <View className="confirm-button">
          <Fab onClick={handleConfirm} className="fab" size="small">
            <Icon
              prefixClass="check"
              type="success_no_circle"
              size="22"
              color="#fff"
            ></Icon>
          </Fab>
        </View>
      </View>
    </Sheet>
  );
};

export default ExerciseSelector;
