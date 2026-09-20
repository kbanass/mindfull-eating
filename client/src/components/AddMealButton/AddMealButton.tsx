import { useRef } from "react";

import styles from "./AddMealButton.module.css";

import AddIcon from "../../assets/icons/add-picture.svg?react";
import type { MealEditorProps } from "../EditMealModal/types";

import { motion } from "motion/react";

type AddMealButtonProps = {
  setEditorProps: (props: MealEditorProps | undefined) => void;
};

export function AddMealButton(props: AddMealButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAdd(
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (file) {
      const editor: MealEditorProps = {
        imageFile: file,
        dateIso: new Date().toISOString(),
      };
      props.setEditorProps(editor);
    }
    e.target.value = "";
  }

  return (
    <div className={styles.buttonWrapper}>
      <motion.button
        whileTap={{ scale: 0.8 }}
        className={styles.button}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <AddIcon />
      </motion.button>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className={styles.input}
        ref={inputRef}
        onChange={(e) => handleAdd(e)}
      />
    </div>
  );
}
