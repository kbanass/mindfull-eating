import styles from "./MoodSummary.module.css";

import type { Meal, MealLocal } from "shared";
import { motion } from "motion/react";

export type MoodSummaryProps = {
  displayedMonthDate: Date;
  meals: Array<MealLocal[]> | undefined;
  todayIndex: number;
};

export function MoodSummary({
  displayedMonthDate,
  meals,
  todayIndex,
}: MoodSummaryProps) {
  const monthStartDay = new Date(
    new Date(displayedMonthDate).setDate(1),
  ).getDay();

  function getDayMood(meals: MealLocal[]): Meal["mood"] | undefined {
    if (meals.length === 0) return undefined;

    const moodsCounts: Record<Meal["mood"], number> = {
      bad: 0,
      ok: 0,
      super: 0,
    };
    meals.forEach((m) => {
      moodsCounts[m.mood]++;
    });

    if (meals.length === 1) return meals[0].mood;
    if (moodsCounts.bad >= 2) return "bad";
    if (moodsCounts.super > moodsCounts.ok) return "super";
    return "ok";
  }
  const monthKey = `${displayedMonthDate.getFullYear()}-${displayedMonthDate.getMonth()}`;

  return (
    <section className={styles.section}>
      <h3>Satisfaction in this month</h3>

      <motion.div
        key={monthKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={`${styles.callendarWrapper} card`}
      >
        <div className={styles.columnHeader}>
          <span>M</span>
          <span>Tu</span>
          <span>W</span>
          <span>Th</span>
          <span>F</span>
          <span>S</span>
          <span>Sun</span>
        </div>
        <div
          className={`${styles.callendar} `}
          style={{ "--start-col": monthStartDay } as React.CSSProperties}
        >
          {meals?.map((m, i) => {
            const dayMood = getDayMood(m);
            return (
              <div
                key={i}
                data-mood={dayMood}
                className={`${styles.day} 
                            ${todayIndex === i ? styles.today : ""} 
                            ${i < todayIndex ? styles.past : ""} 
                            ${
                              displayedMonthDate.getMonth() <
                                new Date().getMonth() &&
                              displayedMonthDate.getFullYear() <
                                new Date().getFullYear()
                                ? styles.past
                                : ""
                            } `}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <ul className={styles.calendarLegend}>
          <li>
            <span
              className={styles.legendColor}
              data-mood="bad"
              aria-hidden="true"
            ></span>
            Bad
          </li>
          <li>
            <span
              className={styles.legendColor}
              data-mood="ok"
              aria-hidden="true"
            ></span>
            Ok
          </li>
          <li>
            <span
              className={styles.legendColor}
              data-mood="super"
              aria-hidden="true"
            ></span>
            Super
          </li>
          <li>
            <span
              className={styles.legendColor}
              data-mood="empty"
              aria-hidden="true"
            ></span>
            Empty
          </li>
        </ul>
      </motion.div>
    </section>
  );
}
