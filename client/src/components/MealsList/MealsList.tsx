import { useLiveQuery } from "dexie-react-hooks";
import { getFormatedDate, isSameDay } from "../../utils/date";

import { MealCard } from "../MealCard/MealCard";
import type { MealEditorProps } from "../EditMealModal/types";
import type { MealLocal } from "shared";
import styles from "./MealsList.module.css";

import PhotoIcon from "../../assets/icons/photo.svg?react";
import AddIcon from "../../assets/icons/add-picture.svg?react";
import { mealService } from "../../storage/services";
import { motion } from "motion/react";

type MealsListProps = {
  currentDate: Date;
  setEditorProps: (props: MealEditorProps | undefined) => void;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function MealsList({ currentDate, setEditorProps }: MealsListProps) {
  const meals: MealLocal[] | undefined = useLiveQuery(async () => {
    const mealsMetaData = await mealService.findMealsFromDateRange(
      new Date(currentDate),
      new Date(currentDate),
    );
    return mealsMetaData;
  }, [currentDate]);

  const pluralRules = new Intl.PluralRules("pl-PL");

  function pluralizeEntries(num: number): string {
    switch (pluralRules.select(num)) {
      case "one":
        return "wpis";
      case "few":
        return "wpisy";
      default:
        return "wpisów";
    }
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.headerWrapper}>
        <h3>
          {isSameDay(new Date(), currentDate)
            ? "Dzisiejsze posiłki"
            : getFormatedDate(currentDate)}
        </h3>
        <small>
          {meals ? meals.length : 0}{" "}
          {pluralizeEntries(meals ? meals?.length : 0)}
        </small>
      </div>
      {meals !== undefined && meals.length > 0 ? (
        <motion.ol
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.mealsList}
        >
          {meals?.map((m) => {
            return (
              <MealCard key={m.id} setEditorProps={setEditorProps} meal={m} />
            );
          })}
        </motion.ol>
      ) : (
        <div className={styles.emptyDay}>
          <PhotoIcon className={styles.photoIcon} />
          <h3>Nic tu jeszcze nie ma</h3>
          <p>
            Wciśnij przycisk
            <AddIcon className={styles.addIcon} /> żeby dodać pierwszy wpis.
          </p>
        </div>
      )}
    </div>
  );
}
