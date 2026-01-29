declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
    last_login: string;
    role: "admin" | "user" | "editor";
  }

  interface UserSession {
    user: User;
  }
}

export {};
