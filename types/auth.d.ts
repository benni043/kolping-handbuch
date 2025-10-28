// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
    role: "admin" | "user";
  }

  interface UserSession {
    user: User;
  }

  interface SecureSessionData {}
}

export {};
