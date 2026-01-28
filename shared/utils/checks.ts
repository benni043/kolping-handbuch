export const PASSWORD_ERROR_MSG =
  "Das Passwort muss mind. 8 Zeichen, 1 Großbuchstaben, 1 Zahl und 1 Sonderzeichen enthalten";

export const USERNAME_ERROR_MSG =
  "Der Benutzername muss mindestens 4 Zeichen lang sein";

export const FOLDER_ERROR_MSG =
  "Der Ordnername muss mindestens 2 Zeichen lang sein";

export const FILE_ERROR_MSG =
  "Der Dateiname muss mindestens 2 Zeichen lang sein";

export const MENU_ERROR_MSG =
  "Der Menuname muss mindestens 4 Zeichen lang sein";

export const PASSWORD_MATCH_ERROR_MSG = "Passwörter stimmen nicht überein";

export function validateUsername(username: string) {
  return username.length >= 4;
}

export function validateFolder(folder: string) {
  return folder.length >= 2;
}

export function validatePassword(password: string) {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~]{8,}$/;

  return regex.test(password);
}

export function validateRole(role: string) {
  return !(role !== "admin" && role !== "editor" && role !== "user");
}

export function validatePasswordMatch(password1: string, password2: string) {
  return password1 === password2;
}
