import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import FilterGroups from "./components/FilterGroups";
import ActionList from "./components/ActionList";
import SearchInput from "./components/SearchInput";
import Card from "../Card";
import "./index.scss";

const SearchFilter = ({ libs = [], selectedActions = [], onActionSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [filteredActions, setFilteredActions] = useState([]);

  // 提取唯一的肌肉和设备列表
  const uniqueMuscles = [...new Set(libs.map((action) => action.muscle))];
  const uniqueEquipments = [...new Set(libs.map((action) => action.equipment))];

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

    console.log("results", results);

    setFilteredActions(results);
  }, [searchText, selectedMuscle, selectedEquipment, libs]);

  // 处理搜索输入
  const handleSearchInput = (e) => {
    setSearchText(e.detail.value);
  };

  // 处理肌肉过滤
  const handleMuscleFilter = (muscle) => {
    setSelectedMuscle(muscle === selectedMuscle ? "" : muscle);
  };

  // 处理设备过滤
  const handleEquipmentFilter = (equipment) => {
    setSelectedEquipment(equipment === selectedEquipment ? "" : equipment);
  };

  return (
    <View className="">
      <Card>
        <SearchInput
          searchText={searchText}
          onSearchChange={handleSearchInput}
        ></SearchInput>
        <FilterGroups
          muscles={uniqueMuscles}
          equipments={uniqueEquipments}
          selectedMuscle={selectedMuscle}
          selectedEquipment={selectedEquipment}
          onMuscleFilter={handleMuscleFilter}
          onEquipmentFilter={handleEquipmentFilter}
        />
      </Card>
      <ActionList
        actions={filteredActions}
        selectedActions={selectedActions} // 传递已选动作
        onActionSelect={onActionSelect} // 传递选择回调
      />
    </View>
  );
};

export default SearchFilter;
