export function getSegment(index: number) {
  const segments = useRoute().path.split("/").filter(Boolean);
  return segments[index];
}
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
  "best-practise",
  "arbeitshilfen",
];

export const mapping = Object.fromEntries(
  categories.map((c, i) => [c, categoriesLower[i]]),
);

export const mappingLower = Object.fromEntries(
  categoriesLower.map((c, i) => [c, categories[i]]),
);

export const contactLower = "contact";
export const contactUpper = "Kontakt";

export const impressumLower = "impressum";
export const impressumUpper = "Impressum";

export const introductionLower = "introduction";
export const introductionUpper = "Einleitung";

export const loginLower = "login";
export const loginUpper = "Anmelden";

export const adminLower = "admin";
export const adminUpper = "Admin";
