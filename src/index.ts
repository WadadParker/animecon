import { Elysia } from "elysia";
import { userRoutes } from "./routes/users.routes";

const app = new Elysia()

app.get("/", () => "Hello Elysia")
app.post("/users/signup",()=>{console.log("This is signup"); return {message:"Works",status:200}});

app.listen(3000);

userRoutes(app)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
