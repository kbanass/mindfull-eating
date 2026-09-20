import { useState } from "react";

import Today from "../../tabs/Today";
import Month from "../../tabs/Month";
import Profile from "../../tabs/Profile";

import type { Tabs } from "../../components/Nav/types";
import { Nav } from "../../components/Nav/Nav";

import styles from "./Main.module.css";

function Main() {
  const [currentTab, setTab] = useState<Tabs>("today");

  function handleTabChange(tab: Tabs) {
    setTab(tab);
  }

  return (
    <div className={styles.mainWrapper}>
      <header className={styles.logo}>
        <Logo />
      </header>
      <main className={styles.main}>
        {currentTab === "today" ? (
          <Today />
        ) : currentTab === "month" ? (
          <Month />
        ) : (
          <Profile />
        )}
      </main>
      <Nav currentTab={currentTab} tabChangeHandler={handleTabChange} />
    </div>
  );
}

export default Main;

function Logo() {
  return (
    <div className={styles.logo}>
      <span>Meal</span>
      <span>Journal</span>
    </div>
  );
}
