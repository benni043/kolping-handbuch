declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
    role: "admin" | "user" | "editor";
  }

  interface UserSession {
    user: User;
  }
}

export {};
