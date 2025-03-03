import Elysia, { t } from "elysia";

export const userRoutes =
new Elysia( {prefix:"users"} )
    .options("/*",({set})=>{
        console.log("This is running")
        set.headers["access-control-allow-methods"] = "POST","GET";
        set.headers["access-control-allow-origin"] = "*";
        set.headers["access-control-allow-headers"] = 'Content-Type, Origin, Accept, Authorization ';
        
        return set
    })
    .post("/signup",({set,body})=>{
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
        })

        set.headers["access-control-allow-methods"] = "POST","GET"
        set.headers["access-control-allow-origin"] = "*"
        set.headers["access-control-allow-headers"] = 'Content-Type, Origin, Accept, Authorization ';
        console.log("THis is body",body)

        return { message: "User created Succesfully!" , jwt:"This is JWT"}
    

    })
    .post("/login",()=>console.log("This is login"))