import { Component } from "react";

import "./app.scss";

import FloatingButton from "./components/FloatingButton/FloatingButton";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <>
        {/* <FloatingButton /> */}
        {this.props.children}
      </>
    );
  }
}

export default App;
