import type { MealLocal } from "shared";
import type { MealEditorProps } from "../EditMealModal/types";
import styles from "./MealCard.module.css";
import {
  moodEmojis,
  triggerEmojis,
  triggerLabels,
} from "../../utils/constants";
import EditIcon from "../../assets/icons/edit.svg?react";
import { getFormatedTime } from "../../utils/date";
import { mealService } from "../../storage/services";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export type MealCardProps = {
  meal: MealLocal;
  setEditorProps: (props: MealEditorProps | undefined) => void;
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
} as const;

export function MealCard({ meal, setEditorProps }: MealCardProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageBlob, setImageBlob] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let url: string | undefined = undefined;

    mealService
      .loadPhoto(meal.photoHash)
      .then((blob) => {
        if (cancelled) return;

        if (!imageUrl && blob) {
          setImageBlob(blob);
          url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [meal.photoHash]);

  async function handleOpenEditor() {
    if (imageBlob) setEditorProps({ ...meal, imageBlob: imageBlob });
  }

  return (
    <motion.div variants={itemVariants} className={`${styles.mealCard} card`}>
      <img className={styles.photo} src={imageUrl} />
      <div className={styles.rightColumnWrapper}>
        <h3 className={styles.time}>
          {getFormatedTime(new Date(meal.dateIso))}
        </h3>
        <button onClick={handleOpenEditor} className={styles.editButton}>
          <EditIcon />
        </button>
        <span className={styles.note}>{meal.note && `"${meal.note}"`}</span>
        <div className={styles.trigger}>
          <span>{triggerEmojis[meal.trigger]}</span>
          <span>{triggerLabels[meal.trigger]}</span>
        </div>
        <span className={styles.mood}>{moodEmojis[meal.mood]}</span>
      </div>
    </motion.div>
  );
}
