import Elysia from "elysia";

export const userRoutes = new Elysia()
    .group("/users",(app)=>
        app
            .post("/signup",()=>{console.log("This is signup"); return {message:"Works",status:200}})
            .post("/login",()=>console.log("This is login"))
);