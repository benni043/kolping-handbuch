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

export type NavMapping = {
  displayName: string;
  redirect: string;
};

export const navMappings: NavMapping[] = [
  {
    displayName: "Inhalt und Zweck",
    redirect: "inhalt-und-zweck",
  },
  {
    displayName: "Hinführung",
    redirect: "hinfuehrung",
  },
  {
    displayName: "Kernprozess",
    redirect: "kernprozess",
  },
  {
    displayName: "Checkliste",
    redirect: "checklist",
  },
  {
    displayName: "Best Practice",
    redirect: "best-practise",
  },
  {
    displayName: "Arbeitshilfen",
    redirect: "arbeitshilfen",
  },
  {
    displayName: "Kontakt",
    redirect: "contact",
  },
  {
    displayName: "Impressum",
    redirect: "impressum",
  },
  {
    displayName: "Einleitung",
    redirect: "introduction",
  },
  {
    displayName: "Anmelden",
    redirect: "login",
  },
  {
    displayName: "Admin",
    redirect: "admin",
  },
  {
    displayName: "",
    redirect: "startpage",
  },
];

export function getDisplayName(redirect: string): string | undefined {
  return navMappings.find((m) => m.redirect === redirect)?.displayName;
}

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

export const startPageLower = "startpage";
export const startPageUpper = "";
