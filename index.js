require('dotenv').config();
import express from 'express';
import prisma from './prismaClient.js'

const app = express();
const port = 3000

const passport = require('passport');
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import pollRouter from './routes/pollRoutes.js';

require('./auth');

app.use(express.json());

app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/polls', pollRouter);

app.get('/',(req,res)=>{
    res.send("welcome to AnimeCon Event Management App");
});

// app.post('/users',async (req,res)=>{
//     const name = "Wadad parker"
//     const email = "wadadparker5@gmail.com"
//     const googleId= "123"
//     try {
//         const user = await prisma.user.create({
//             data: {name,email,googleId},
//         })
//         res.json(user);
//     }
//     catch(error) {
//         res.status(500).json({error:error.message})
//     }
// })

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})