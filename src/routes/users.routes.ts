import Elysia from "elysia";

export const userRoutes = (app: Elysia) => {

    app.post("/users/signup",()=>{console.log("This is signup"); return {message:"Works",status:200}});
    app.post("/users/login",()=>console.log("This is login"));
}