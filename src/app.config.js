export default {
  pages: ["pages/index/index", "pages/library/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: false,
    color: "#999",
    selectedColor: "#1296db",
    backgroundColor: "#fff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
      },
      {
        pagePath: "pages/library/index",
        text: "动作库",
        iconPath: "./assets/tab-bar/actions.png",
        selectedIconPath: "./assets/tab-bar/actions-active.png",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
};
