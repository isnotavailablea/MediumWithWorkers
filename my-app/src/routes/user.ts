import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import zod from "zod"
// Create the main Hono app
export const userRouter =  new Hono<{
  Bindings : {
      DATABASE_URL : string,
      JWT_SECRET : string
  }
}>;

const userEssentials = zod.object({
  email : zod.string().min(2).max(30),
  password : zod.string().min(3).max(30)
})
const userName = zod.string().min(3).max(30)

userRouter.post('/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL ,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    if(!body || !body.email || !body.password || !body.email)throw "doesnot work"
    const data = {
      email: body.email,
      password: body.password,
      name : body.name
      }
      
      
      const zodCheck = userEssentials.safeParse({email : data.email, password : data.password});
      if(!zodCheck.success){
          // console.log(zodCheck.error)
          c.status(403)
          return c.json({
              message : "Signup Body invalid"
          })
      }
      
      if(!userName.safeParse(data.name).success){
        
        c.status(403)
        return c.json({
            message : "Signup Body invalid"
        })
      }
    const user = await prisma.user.create({
      data
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ token : jwt });
  } catch(e) {
    console.log(e)
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
  })

userRouter.post('/signin', async (c) => {
    try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL ,
        }).$extends(withAccelerate());
      const body = await c.req.json();
      if(!body || !body.email || !body.password)throw "Not valid"
      const data = {
        email: body.email,
          password : body.password
      }
      const zodCheck = userEssentials.safeParse(data);
      if(!zodCheck.success){
        // console.log(zodCheck.error)
        c.status(403)
        return c.json({
            message : "Signup Body invalid"
        })
    }
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
          password : body.password
        }
        });
        if (!user) {
        c.status(403);
      return c.json({ error: "user not found" });
      }
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ token : jwt });
    }catch(err){
      c.status(403);
      return c.json({
        error : "Error Occured!"
      })
    }
      
})


userRouter.get('/all' , async (c) => {
    try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL ,
        }).$extends(withAccelerate());

      const users = await prisma.user.findMany()
      return c.json(users)
    }catch(err){
        c.status(403)
        return c.json({
          error : "Unable to Fetch Users"
        })
    }
})

userRouter.get('/bulk' , async (c) => {
  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL ,
      }).$extends(withAccelerate());
    const posts = await prisma.post.findMany({
       take : 5
    })
    return c.json(posts)
  }catch(err){

  }
})