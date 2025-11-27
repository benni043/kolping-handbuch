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

export const categories = [
  "Inhalt und Zweck",
  "Hinführung",
  "Kernprozess",
  "Checkliste",
  "Best Practice",
  "Arbeitshilfen",
];

export function getSegment(index: number) {
  const segments = useRoute().path.split("/").filter(Boolean);
  return segments[index];
}

export function getDisplayName(redirect: string): string | undefined {
  return navMappings.find((m) => m.redirect === redirect)?.displayName;
}

export function getRedirect(displayName: string): string | undefined {
  return navMappings.find((m) => m.displayName === displayName)?.redirect;
}
