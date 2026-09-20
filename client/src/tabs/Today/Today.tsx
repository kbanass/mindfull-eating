import { AddMealButton } from "../../components/AddMealButton/AddMealButton";

import styles from "./Today.module.css";
import { MealsList } from "../../components/MealsList/MealsList";
import { useState } from "react";
import { DayPicker } from "../../components/DayPicker/DayPicker";
import { EditMealModal } from "../../components/EditMealModal/EditMealModal";
import type { MealEditorProps } from "../../components/EditMealModal/types";

function Today() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [editorProps, setEditorProps] = useState<MealEditorProps>(undefined);

  function handleDateChange(newDate: Date) {
    setCurrentDate(newDate);
  }

  return (
    <div className={styles.todayWrapper}>
      <DayPicker
        currentDate={currentDate}
        handleDateChange={handleDateChange}
      />
      <MealsList
        key={currentDate.toISOString()}
        setEditorProps={setEditorProps}
        currentDate={currentDate}
      />
      <AddMealButton setEditorProps={setEditorProps} />
      <EditMealModal
        editorOptions={editorProps}
        setEditorOptions={setEditorProps}
      />
    </div>
  );
}

export default Today;
