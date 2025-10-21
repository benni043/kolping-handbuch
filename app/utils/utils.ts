export const categories = [
  "Inhalt und Zweck",
  "Hinführung",
  "Kernprozess",
  "Checkliste",
  "Best Practice",
  "Arbeitshilfen",
];

export const categoriesLower = [
  "inhalt-und-zweck",
  "hinfuehrung",
  "kernprozess",
  "checkliste",
  "best-practice",
  "arbeitshilfen",
];

export const mapping = Object.fromEntries(
  categories.map((c, i) => [c, categoriesLower[i]]),
);
