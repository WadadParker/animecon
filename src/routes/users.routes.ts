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

        console.log("API request for Signup")

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
        } 
        catch (error: any) {
            // PostgreSQL unique constraint error code is typically "23505"
            if(error?.errno == 23505){
            console.log("Error happened",error)
            set.status = 403;
            return { error: "Email already exists" };}

            set.status = 422;
            return { error: "DB Operation Failed" }
          }
    

    })
    .post("/login", async ({set,body})=>{
        body: t.Object({
            email: t.String(),
            password: t.String(),
        })
        
        console.log("API request for Login")
        const { email, password } = body as {email:string,password:string};

        set.headers["access-control-allow-methods"] = "POST","GET"
        set.headers["access-control-allow-origin"] = "*"
        set.headers["access-control-allow-headers"] = 'Content-Type, Origin, Accept, Authorization ';

        try {
            const result = await sql`
                SELECT user_id,paid
                FROM users 
                WHERE
                    email = ${email}
                    AND password = ${password}
                `

                console.log("This is result",result[0])
                if(result[0])
                {
                    set.status = 200
                    return { message: "User Logged In" , jwt:result[0] , paid:result[0]?.paid}
                }

                set.status = 400
                return { message: "Incorrect email/password"}

        } 
        catch (error: any) {
            set.status = 422;
            console.log("Error in DB opertion",error)
            return { error: "DB Operation Failed" }
          }

    })