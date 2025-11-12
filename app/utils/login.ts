export function validateUsername(username: string) {
  if (username.length < 4)
    return "Benutzername muss mindestens 4 Zeichen lang sein";
  return "";
}

export function validatePassword(password: string) {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[{\]};:'",<.>/?\\|`~]{8,}$/;

  if (regex.test(password)) return "";
  return "Passwort muss mind. 8 Zeichen, 1 Großbuchstaben, 1 Zahl und 1 Sonderzeichen enthalten";
}

export function validatePasswordMatch(password1: string, password2: string) {
  if (password1 === password2) return "";
  return "Passwörter stimmen nicht überein";
}
