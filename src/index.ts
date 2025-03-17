import { Elysia } from "elysia";
import { initDB } from "./db/db";
import { userRoutes } from "./routes/users.routes";

initDB();

const app = new Elysia()

  .get("/", () => "Hello Elysia")
  .use(userRoutes)
  .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
