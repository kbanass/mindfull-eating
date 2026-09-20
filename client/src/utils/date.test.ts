import { describe, expect, it } from "vitest";
import {
  getDateFromNextWeek,
  getDateFromPreviusWeek,
  getDayStartAndEnd,
  isSameDay,
  getDayStart,
  getDayEnd,
  getFormatedDate,
  getFormatedTime,
  getFormatedFullDateAndTime,
  getMonthNamePL,
} from "./date";

describe("isSameDay", () => {
  it(`Returns true for 2 "new Date()" instances`, () => {
    expect(isSameDay(new Date(), new Date())).toBe(true);
  });

  it(`Returns false for todays Date and for next day Date `, () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(isSameDay(new Date(), tomorrow)).toBe(false);
  });
});

describe("getDayStart", () => {
  it(`Return start of a given day correctly`, () => {
    expect(getDayStart(new Date(2026, 9, 13, 23, 59, 59, 999))).toEqual(
      new Date(2026, 9, 13, 0, 0, 0, 0),
    );
  });
});

describe("getDayEnd", () => {
  it(`Return end of a given day correctly`, () => {
    expect(getDayEnd(new Date(2026, 9, 13, 0, 0, 1, 999))).toEqual(
      new Date(2026, 9, 13, 23, 59, 59, 999),
    );
  });
});

describe("getDayStartAndEnd", () => {
  it("Returns start and end of a given date", () => {
    const input = new Date(2026, 6, 15, 13, 45, 30);
    const [start, end] = getDayStartAndEnd(input);

    expect(start).toEqual(new Date(2026, 6, 15, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 6, 15, 23, 59, 59, 999));
  });
});

describe("getDateFromNextWeek", () => {
  it("Returns 7 days in future correctly", () => {
    const input = new Date(2026, 6, 15);

    const output = getDateFromNextWeek(input);
    expect(output).toEqual(new Date(2026, 6, 22));
    expect(output).not.toBe(input);
  });

  it("Returns 7 days in future correctly, even if there is New Year in between dates", () => {
    const input = new Date(2027, 12, 31);

    const output = getDateFromNextWeek(input);
    expect(output).toEqual(new Date(2028, 1, 7));
    expect(output).not.toBe(input);
  });
});

describe("getDateFromPreviusWeek", () => {
  it("Returns 7 days in past", () => {
    const input = new Date(2026, 6, 15);

    const output = getDateFromPreviusWeek(input);
    expect(output).toEqual(new Date(2026, 6, 8));
    expect(output).not.toBe(input);
  });

  it("Returns 7 days in past correctly, even if there is New Year in between dates", () => {
    const input = new Date(2027, 1, 4);

    const output = getDateFromPreviusWeek(input);
    expect(output).toEqual(new Date(2026, 12, 28));
    expect(output).not.toBe(input);
  });
});

describe("getFormatedDate", () => {
  it("Returns stringified date in DD.MM format", () => {
    expect(getFormatedDate(new Date(2026, 2, 1, 2, 23))).toBe("01.03");
  });
});

describe("getFormatedTime", () => {
  it("Returns stringified time in HH:MM format", () => {
    expect(getFormatedTime(new Date(2026, 3, 1, 2, 2))).toBe("02:02");
  });
});

describe("getFormatedFullDateAndTime", () => {
  it("Returns stringified date in DD.MM.YYYY, HH:MM format", () => {
    expect(getFormatedFullDateAndTime(new Date(2026, 2, 1, 2, 2))).toBe(
      "01.03.2026, 02:02",
    );
  });
});

describe("getMonthNamePL", () => {
  it("Returns name of month from given date in Polish", () => {
    expect(getMonthNamePL(new Date(2026, 0, 1, 2, 2))).toBe("Styczeń");
  });
  it("Returns name of month from given date in Polish", () => {
    expect(getMonthNamePL(new Date(2026, 11, 1, 2, 2))).toBe("Grudzień");
  });
});
