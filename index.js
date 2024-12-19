import express from 'express';
import prisma from './prismaClient.js'

const app = express();
const port = 3000

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("welcome to AnimeCon Event Management App");
});

app.post('/users',async (req,res)=>{
    const name = "Wadad parker"
    const email = "wadadparker5@gmail.com"
    const googleId= "123"
    try {
        const user = await prisma.user.create({
            data: {name,email,googleId},
        })
        res.json(user);
    }
    catch(error) {
        res.status(500).json({error:error.message})
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})