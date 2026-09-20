import styles from "./SummaryMonthPicker.module.css";
import LeftArrow from "../../assets/icons/left-arrow.svg?react";
import RightArrow from "../../assets/icons/right-arrow.svg?react";

import { motion } from "motion/react";
import { getMonthNamePL } from "../../utils/date";

import type { MealLocal } from "shared";

import { triggerEmojis } from "../../utils/constants";
import { getMaxKey } from "../../utils/utils";

export type SummaryMonthPickerProps = {
  displayedMonthDate: Date;
  setDisplayedMonthDate: (newDisplayedMonth: Date) => void;
  meals: Array<MealLocal[]> | undefined;
};

export function SummaryMonthPicker({
  displayedMonthDate,
  setDisplayedMonthDate,
  meals,
}: SummaryMonthPickerProps) {
  const monthLength = new Date(
    displayedMonthDate.getFullYear(),
    displayedMonthDate.getMonth() + 1,
    0,
  ).getDate();

  function switchToPreviusMonth() {
    const newDate = new Date(displayedMonthDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setDisplayedMonthDate(newDate);
  }
  function switchToNextMonth() {
    const newDate = new Date(displayedMonthDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setDisplayedMonthDate(newDate);
  }

  function getNumOfDaysWithEntry() {
    let count = 0;
    if (meals) {
      meals.forEach((m) => {
        if (m.length > 0) count++;
      });
    }
    return count;
  }

  function getMostCommonTrigger() {
    const triggerCounts: Record<MealLocal["trigger"], number> = {
      boredom: 0,
      craving: 0,
      hunger: 0,
      routine: 0,
      social: 0,
      stress: 0,
    };

    if (meals) {
      meals.forEach((m) => {
        m.forEach((m) => triggerCounts[m.trigger]++);
      });
    }

    const maxKey = getMaxKey(triggerCounts);

    return maxKey ? triggerEmojis[maxKey] : "";
  }

  function getNumOfMeals(): number {
    let count = 0;
    if (meals) {
      meals.forEach((m) => {
        count += m.length;
      });
    }
    return count;
  }
  const monthKey = `${displayedMonthDate.getFullYear()}-${displayedMonthDate.getMonth()}`;

  return (
    <section className={`${styles.cardWrapper} card`}>
      <header className={styles.header}>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onPointerDown={switchToPreviusMonth}
        >
          <LeftArrow />
        </motion.button>
        <h2>{`${getMonthNamePL(displayedMonthDate)} ${displayedMonthDate.getFullYear()}`}</h2>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onPointerDown={switchToNextMonth}
        >
          <RightArrow />
        </motion.button>
      </header>
      <motion.dl
        key={monthKey}
        initial={{ opacity: 0.2, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.summaryStats}
      >
        <div className={styles.stat}>
          <dt>{getNumOfMeals()}</dt>
          <dd>Posiłki</dd>
        </div>

        <div className={styles.stat}>
          <dt>
            {getNumOfDaysWithEntry()}
            <span>/{monthLength}</span>
          </dt>
          <dd>Dni z wpisem</dd>
        </div>

        <div className={styles.stat}>
          <dt>{getMostCommonTrigger()}</dt>
          <dd>
            <span>Najczęściej</span>
          </dd>
        </div>
      </motion.dl>
    </section>
  );
}
