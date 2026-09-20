import styles from "./EditMealModal.module.css";
import { Sheet } from "react-modal-sheet";

import type { MealEditorProps } from "./types";
import { Meal, type MealLocal } from "shared";

import type React from "react";
import { useEffect, useState } from "react";

import {
  moodEmojis,
  moodLabels,
  triggerEmojis,
  triggerLabels,
} from "../../utils/constants";
import {
  getFormatedFullDateAndTime,
  getFormatedTime,
  isSameDay,
} from "../../utils/date";

import DeleteIcon from "../../assets/icons/delete.svg?react";
import useSound from "../../hooks/useSound";
import { mealService } from "../../storage/services";

type EditMealModalProps = {
  editorOptions: MealEditorProps;
  setEditorOptions: (editorOptions: MealEditorProps) => void;
};

export function EditMealModal(props: EditMealModalProps) {
  const [displayedOptions, setDisplayedOptions] =
    useState<MealEditorProps>(undefined);

  if (props.editorOptions && props.editorOptions !== displayedOptions) {
    setDisplayedOptions(props.editorOptions);
  }

  function closeModal() {
    props.setEditorOptions(undefined);
  }
  return (
    <Sheet isOpen={!!props.editorOptions} onClose={closeModal}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content className={styles.sheetContent}>
          {displayedOptions && (
            <EditMealForm
              displayedOptions={displayedOptions}
              closeModal={closeModal}
            />
          )}
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}

type FormValues = Partial<Pick<Meal, "trigger" | "mood" | "note">>;

type EditMealFormProps = {
  displayedOptions: MealEditorProps;
  closeModal: () => void;
};

function EditMealForm({ displayedOptions, closeModal }: EditMealFormProps) {
  const playSuccess = useSound("sounds/success.mp3", 0.005);

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const [currentInput, setCurrentInput] = useState<
    Partial<Pick<Meal, "trigger" | "mood" | "note">>
  >({
    trigger: undefined,
    mood: undefined,
    note: undefined,
  });

  let title = "";
  let formatedDate = "";

  if (displayedOptions) {
    title = "id" in displayedOptions ? "Edytuj posiłek" : "Nowy posiłek";

    const date = new Date(displayedOptions.dateIso);
    formatedDate = isSameDay(new Date(), date)
      ? `Dziś ${getFormatedTime(date)}`
      : getFormatedFullDateAndTime(date);
  }

  useEffect(() => {
    let url = "";

    if (displayedOptions) {
      url =
        "imageFile" in displayedOptions
          ? URL.createObjectURL(displayedOptions.imageFile)
          : URL.createObjectURL(displayedOptions.imageBlob);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrl(url);

      if ("id" in displayedOptions)
        setCurrentInput({
          trigger: displayedOptions.trigger,
          mood: displayedOptions.mood,
          note: displayedOptions.note,
        });
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [displayedOptions]);

  function handleInputChange<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    if (field === "note" && value === "") {
      setCurrentInput((prev) => ({ ...prev, [field]: undefined }));
      return;
    }
    setCurrentInput((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!displayedOptions) return;

    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if ("id" in displayedOptions) {
      const raw = {
        ...Object.fromEntries(formData),
        id: displayedOptions.id,
        photoHash: displayedOptions.photoHash,
        dateIso: displayedOptions.dateIso,
        isMetaSynced: displayedOptions.isMetaSynced,
        isPhotoSynced: displayedOptions.isPhotoSynced,
      } as MealLocal;

      try {
        const serviceResponse = await mealService.updateMeal(raw);
        if (serviceResponse.success) {
          playSuccess();
          setTimeout(() => {
            closeModal();
          }, 800);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const raw = {
        ...Object.fromEntries(formData),
        dateIso: displayedOptions.dateIso,
      } as Meal;

      try {
        const serviceResponse = await mealService.saveMeal(
          raw,
          displayedOptions.imageFile,
        );
        if (serviceResponse.success) {
          playSuccess();
          setTimeout(() => {
            closeModal();
          }, 800);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function deleteMeal() {
    if (displayedOptions && "id" in displayedOptions) {
      try {
        const res = await mealService.deleteMeal(
          displayedOptions.id,
          displayedOptions.photoHash,
        );
        if (res.success) closeModal();
        else console.log(res.error);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function isFormFilled(): boolean {
    if (currentInput?.mood && currentInput?.trigger) {
      return true;
    }
    return false;
  }

  function isFormChanged(): boolean {
    if (displayedOptions) {
      if (!("id" in displayedOptions)) return true;

      if (
        currentInput?.mood !== displayedOptions.mood ||
        currentInput?.trigger !== displayedOptions.trigger ||
        currentInput?.note !== displayedOptions.note
      )
        return true;
    }
    return false;
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formContent}>
        <h2>{title}</h2>
        <small>{formatedDate}</small>

        <img className={styles.mealPhoto} src={imageUrl}></img>

        <form onSubmit={handleSubmit} id="meal-edit-form">
          <fieldset>
            <legend>
              <h4>Dlaczego jem?</h4>
              <small>Zauważ co uruchomiło tą decyzję</small>
            </legend>
            <div className={styles.radioButtonsList}>
              {Object.entries(triggerLabels).map((trigger) => {
                return (
                  <div className={styles.radioButtonWrapper} key={trigger[0]}>
                    <input
                      name="trigger"
                      id={trigger[0]}
                      type="radio"
                      value={trigger[0]}
                      defaultChecked={
                        displayedOptions && "id" in displayedOptions
                          ? displayedOptions.trigger === trigger[0]
                          : undefined
                      }
                      onChange={() =>
                        handleInputChange(
                          "trigger",
                          trigger[0] as Meal["trigger"],
                        )
                      }
                    ></input>
                    <label htmlFor={trigger[0]}>
                      <span>
                        {triggerEmojis[trigger[0] as Meal["trigger"]]}
                      </span>
                      <span>{trigger[1]}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h4>Jak oceniasz tą decyzję?</h4>
            </legend>
            <div className={styles.radioButtonsList}>
              {Object.entries(moodLabels).map((mood) => {
                return (
                  <div className={styles.radioButtonWrapper} key={mood[0]}>
                    <input
                      name="mood"
                      id={mood[0]}
                      type="radio"
                      value={mood[0]}
                      defaultChecked={
                        displayedOptions && "id" in displayedOptions
                          ? displayedOptions.mood === mood[0]
                          : undefined
                      }
                      onChange={() =>
                        handleInputChange("mood", mood[0] as Meal["mood"])
                      }
                    ></input>
                    <label htmlFor={mood[0]}>
                      <span>{moodEmojis[mood[0] as Meal["mood"]]}</span>
                      <span>{mood[1]}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className={styles.noteLegend}>
              <h4>Notatka </h4> <small> (opcjonalnie)</small>
            </legend>
            <textarea
              minLength={0}
              maxLength={48}
              name="note"
              defaultValue={
                displayedOptions && "id" in displayedOptions
                  ? displayedOptions.note
                  : undefined
              }
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Co jadłeś? Jak się wtedy czułeś?"
            ></textarea>
          </fieldset>
        </form>
        {displayedOptions && "id" in displayedOptions && (
          <button onPointerDown={deleteMeal} className={styles.deleteButton}>
            <DeleteIcon />
            Usuń posiłek
          </button>
        )}
      </div>
      <div className={styles.submitButtonWrapper}>
        <button
          form="meal-edit-form"
          disabled={!isFormChanged() || !isFormFilled()}
          type="submit"
        >
          Zapisz posiłek
        </button>
      </div>
    </div>
  );
}
