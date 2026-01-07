export function validateUsername(username: string) {
  if (username.length < 4) return false;
  return true;
}

export function validateFolder(folder: string) {
  if (folder.length < 2) return false;
  return true;
}

export function validatePassword(password: string) {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~]{8,}$/;

  if (regex.test(password)) return true;
  return false;
}

export function validateRole(role: string) {
  if (role !== "admin" && role !== "editor" && role !== "user") return false;
  return true;
}

export function validatePasswordMatch(password1: string, password2: string) {
  if (password1 === password2) return true;
  return false;
}

export const PASSWORD_ERROR_MSG =
  "Das Passwort muss mind. 8 Zeichen, 1 Großbuchstaben, 1 Zahl und 1 Sonderzeichen enthalten";

export const USERNAME_ERROR_MSG =
  "Der Benutzername muss mindestens 4 Zeichen lang sein";

export const FOLDER_ERROR_MSG =
  "Der Ordnername muss mindestens 2 Zeichen lang sein";

export const FILE_ERROR_MSG =
  "Der Dateiname muss mindestens 2 Zeichen lang sein";

export const PASSWORD_MATCH_ERROR_MSG = "Passwörter stimmen nicht überein";
