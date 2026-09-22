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

  return (
    <div className={styles.listWrapper}>
      <div className={styles.headerWrapper}>
        <h3>
          {isSameDay(new Date(), currentDate)
            ? "Today's meals"
            : getFormatedDate(currentDate)}
        </h3>
        <small>
          {meals ? meals.length : 0} {meals?.length === 1 ? "meal" : "meals"}
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
          <h3>There are no meals here yet</h3>
          <p>
            Click a button
            <AddIcon className={styles.addIcon} /> to add Your first meal
          </p>
        </div>
      )}
    </div>
  );
}
