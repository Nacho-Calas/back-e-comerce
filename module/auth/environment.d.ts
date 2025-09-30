declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "dev" | "prod";
      DISCORD_WEBHOOK_URL: string;
      USERS_TABLE: string;
      JWT_SECRET: string;
    }
  }
}

export {};
