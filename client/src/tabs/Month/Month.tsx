import { useState } from "react";
import { SummaryMonthPicker } from "../../components/SummaryMonthPicker/SummaryMonthPicker";
import { getMonthStartAndEnd } from "../../utils/date";
import { mealService } from "../../storage/services";
import type { MealLocal } from "shared";
import { useLiveQuery } from "dexie-react-hooks";
import { MoodSummary } from "../../components/MoodSummary/MoodSummary";
import styles from "./Month.module.css";
import { TriggerSummary } from "../../components/TriggerSummary/TriggerSummary";

function Month() {
  const [displayedMonthDate, setDisplayedMonthDate] = useState<Date>(
    new Date(),
  );

  const meals: Array<MealLocal[]> | undefined = useLiveQuery(async () => {
    const mealsMetaData = await mealService.findMealsFromDateRange(
      ...getMonthStartAndEnd(new Date(displayedMonthDate)),
    );

    const monthLength = new Date(
      displayedMonthDate.getFullYear(),
      displayedMonthDate.getMonth() + 1,
      0,
    ).getDate();

    const mealsByDates = Array.from(
      { length: monthLength },
      () => [] as MealLocal[],
    );

    mealsMetaData?.map((m) => {
      const date = new Date(m.dateIso).getDate();
      mealsByDates[date - 1].push(m);
    });

    return mealsByDates;
  }, [displayedMonthDate]);

  function getTodayIndex(): number {
    const today = new Date();

    if (
      today.getMonth() === displayedMonthDate.getMonth() &&
      today.getFullYear() === displayedMonthDate.getFullYear()
    ) {
      const todayIndex = new Date().getDate() - 1;
      return todayIndex;
    }
    return -1;
  }

  return (
    <div className={styles.monthWrapper}>
      <SummaryMonthPicker
        setDisplayedMonthDate={setDisplayedMonthDate}
        displayedMonthDate={displayedMonthDate}
        meals={meals}
      />
      <MoodSummary
        meals={meals}
        displayedMonthDate={displayedMonthDate}
        todayIndex={getTodayIndex()}
      />
      <TriggerSummary meals={meals} />
    </div>
  );
}

export default Month;
