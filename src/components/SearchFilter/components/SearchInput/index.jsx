import React from "react";
import { View, Input } from "@tarojs/components";
import "./index.scss";

const SearchInput = ({ searchText = "", onSearchChange }) => {
  return (
    <View className="search-section">
      <Input
        className="search-input"
        type="text"
        placeholder="搜索动作名称"
        value={searchText}
        onInput={onSearchChange}
      />
    </View>
  );
};

export default SearchInput;
