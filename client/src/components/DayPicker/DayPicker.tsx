import styles from "./DayPicker.module.css";

import LeftArrow from "../../assets/icons/left-arrow.svg?react";
import RightArrow from "../../assets/icons/right-arrow.svg?react";
import {
  getDateFromNextWeek,
  getDateFromPreviusWeek,
  getMonthNamePL,
  isSameDay,
} from "../../utils/date";

import { motion } from "motion/react";
import useSound from "../../hooks/useSound";

type DayPickerProps = {
  currentDate: Date;
  handleDateChange: (newDate: Date) => void;
};

export function DayPicker({ currentDate, handleDateChange }: DayPickerProps) {
  const currentWeekDates: Date[] = [];
  const playSound = useSound("sounds/click.mp3", 0.005);

  const selectedWeekDayNumber =
    currentDate.getDay() === 0 ? 7 : currentDate.getDay();

  currentWeekDates.push(currentDate);

  for (let i = selectedWeekDayNumber + 1; i <= 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + (i - selectedWeekDayNumber));
    currentWeekDates.push(date);
  }

  for (let i = selectedWeekDayNumber - 1; i > 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - (selectedWeekDayNumber - i));
    currentWeekDates.unshift(date);
  }

  function switchToPreviusWeek() {
    const newDate = getDateFromPreviusWeek(currentDate);
    handleDateChange(newDate);
  }

  function switchToNextWeek() {
    const newDate = getDateFromNextWeek(currentDate);
    handleDateChange(newDate);
  }

  return (
    <div className={`${styles.dayPicker} card`}>
      <div className={styles.nav}>
        <h3>
          {getMonthNamePL(currentDate) + currentDate.getFullYear().toString()}
        </h3>
        <div className={styles.buttonWrapper}>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onPointerDown={switchToPreviusWeek}
          >
            <LeftArrow />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onPointerDown={switchToNextWeek}
          >
            <RightArrow />
          </motion.button>
        </div>
      </div>
      <ol className={styles.daysList}>
        {WeekDaysNamesValues.map((day, i) => (
          <Button
            dayOfTheWeek={day}
            playSound={playSound}
            dayOfTheMonth={currentWeekDates[i].getDate()}
            isSelected={isSameDay(currentDate, currentWeekDates[i])}
            isToday={isSameDay(currentWeekDates[i], new Date())}
            key={currentWeekDates[i].getDate()}
            onPointerDown={() => handleDateChange(currentWeekDates[i])}
          />
        ))}
      </ol>
    </div>
  );
}

const WeekDaysNamesValues = ["pn", "wt", "śr", "cz", "pt", "so", "nd"] as const;

type WeekDaysNames = (typeof WeekDaysNamesValues)[number];

type ButtonProps = {
  dayOfTheWeek: WeekDaysNames;
  dayOfTheMonth: number;
  isSelected: boolean;
  isToday: boolean;
  playSound: () => void;
  onPointerDown: () => void;
};

function Button(props: ButtonProps) {
  return (
    <li>
      <motion.button
        initial={{ opacity: 0.2, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.8 }}
        onPointerDown={() => {
          props.playSound();
          props.onPointerDown();
        }}
        className={`${styles.dayButton} ${props.isSelected && styles.selected} ${props.isToday && styles.today}`}
        type="button"
      >
        <span>{props.dayOfTheWeek}</span>
        <span>{props.dayOfTheMonth}</span>
      </motion.button>
    </li>
  );
}
