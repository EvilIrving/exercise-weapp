import { Component } from "react";

import "./app.scss";
// import "taro-ui/dist/style/index.scss"; // 全局引入一次即可

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <>{this.props.children}</>;
  }
}

export default App;
