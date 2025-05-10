import React, { useState, useEffect } from "react";

import { View } from "@tarojs/components";
import { libs } from "../../models/data";
import { Input, Filters, Library, Card } from "../../components/ui";

import "./index.scss";

const Librarys = () => {
  const [filteredExercises, setFilteredExercises] = useState(libs);
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
      results = results.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 根据肌肉部位过滤
    if (selectedMuscle && selectedMuscle !== "全部") {
      results = results.filter(
        (exercise) => exercise.muscle === selectedMuscle
      );
    }

    // 根据设备过滤
    if (selectedEquipment && selectedEquipment !== "全部") {
      results = results.filter(
        (exercise) => exercise.equipment === selectedEquipment
      );
    }

    setFilteredExercises(results);
  }, [searchText, selectedMuscle, selectedEquipment, libs]);

  return (
    <View className="actions-page">
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
      <View className="exercise-list">
        <Library exercises={filteredExercises} />
      </View>
    </View>
  );
};

export default Librarys;
