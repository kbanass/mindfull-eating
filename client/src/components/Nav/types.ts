export type Tabs = "today" | "month" | "profile";

export type NavProps = {
  currentTab: Tabs;
  tabChangeHandler: (tab: Tabs) => void;
};
