import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import SearchInput from "./components/SearchInput";
import FilterGroups from "./components/FilterGroups";
import ActionList from "./components/ActionList";
import useDebounce from "../../hooks/useDebounce";
import Card from "../Card";

const SearchFilter = ({ libs }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");

  // 使用防抖的搜索文本
  const debouncedSearchText = useDebounce(searchText, 500);

  // 处理函数
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMuscleFilter = (muscle) => {
    setSelectedMuscle(selectedMuscle === muscle ? "" : muscle);
  };

  const handleEquipmentFilter = (equipment) => {
    setSelectedEquipment(selectedEquipment === equipment ? "" : equipment);
  };
  // 获取所有可用的肌肉部位和设备类型（去重）
  const muscles = [...new Set(libs.map((item) => item.muscle))];
  const equipments = [...new Set(libs.map((item) => item.equipment))];

  // 根据筛选条件过滤动作
  const [filteredActions, setFilteredActions] = useState([]);

  useEffect(() => {
    let result = [...libs];

    // 使用防抖后的搜索文本进行过滤
    if (debouncedSearchText) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearchText.toLowerCase())
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
  }, [libs, debouncedSearchText, selectedMuscle, selectedEquipment]);

  return (
    <>
      <Card>
        <View className="search-filter-container">
          <SearchInput
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />
          <FilterGroups
            muscles={muscles}
            equipments={equipments}
            selectedMuscle={selectedMuscle}
            selectedEquipment={selectedEquipment}
            onMuscleFilter={handleMuscleFilter}
            onEquipmentFilter={handleEquipmentFilter}
          />
        </View>
      </Card>
      <ActionList actions={filteredActions} />
    </>
  );
};

export default SearchFilter;
