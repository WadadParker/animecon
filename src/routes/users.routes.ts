import Elysia, { t } from "elysia";
import { sql } from "bun";

export const userRoutes =
new Elysia( {prefix:"users"} )
    .options("/*",({set})=>{
        console.log("This is running")
        set.headers["access-control-allow-methods"] = "POST","GET";
        set.headers["access-control-allow-origin"] = "*";
        set.headers["access-control-allow-headers"] = 'Content-Type, Origin, Accept, Authorization ';
        
        return set
    })
    .post("/signup", async ({set,body})=>{
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
        })

        const { name, email, password } = body as {name:string,email:string,password:string}

        set.headers["access-control-allow-methods"] = "POST","GET"
        set.headers["access-control-allow-origin"] = "*"
        set.headers["access-control-allow-headers"] = 'Content-Type, Origin, Accept, Authorization ';

        try {
            const result = await sql`
                INSERT INTO users (name, email, password)
                VALUES (${name}, ${email} , ${password} )
                RETURNING user_id , email
                `
                set.status = 200
        
                return { message: "User created Succesfully!" , jwt:result[0]}
        } catch (error: any) {
            // PostgreSQL unique constraint error code is typically "23505"
            if(error?.errno == 23505){
            console.log("Error happened",error)
            set.status = 403;
            return { error: "Email already exists" };}

            set.status = 422;
            return { error: "DB Operation Failed" }
          }
    

    })
    .post("/login",()=>console.log("This is login"))