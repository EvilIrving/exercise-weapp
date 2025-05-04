import { View } from "@tarojs/components";
import { libs } from "../../models/data";
import SearchFilter from "../../components/SearchFilter";

import "./index.scss";

const Actions = () => {
  return (
    <View className="actions-page">
      <SearchFilter libs={libs} />
    </View>
  );
};

export default Actions;
