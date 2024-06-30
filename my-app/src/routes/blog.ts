import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import zod from 'zod'
export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables:{
      userId : string,
    }
}>
const tokenSchema = zod.string()

const userSchema = zod.object({
    email : zod.string().min(1).max(10),
    password : zod.string().min(3).max(10),
    name : zod.string().min(3).max(10)
})
blogRouter.use('/:token/*' , async (c , next) => {
  try{
    
    let jwt : string | undefined ;
    jwt = c.req.param('token')
    if(!tokenSchema.safeParse(jwt).success){
       throw "Not allowed"
    }
    const payload =  await verify(jwt , c.env.JWT_SECRET)
    if(!payload || !payload.id){
       throw "Not valid Token";
    }
    if(!tokenSchema.safeParse(payload.id).success){
      throw "Not allowed"
   }
    c.set("userId" , payload.id.toString());
    await next()
}catch(err){
  c.status(403)
   return c.json({
      error : "Some Error Occured"
   })
}
})

blogRouter.use('/*' , async (c , next) => {
    try{
        let jwt : string | undefined ;
        if(c.req.method !== "GET"){
          const body = await c.req.json();
          if(!tokenSchema.safeParse(body.token).success){
            throw "Not allowed"
         }
          jwt = body.token
        }
        else{
            await next();
            return ;
        }
        if(!jwt){
            throw "No Token Provided";
        }
        // console.log("here " , c.env.JWT_SECRET)
        const payload =  await verify(jwt , c.env.JWT_SECRET)
        if(payload === undefined || !payload.id){
           throw "Not valid Token";
        }
        if(!tokenSchema.safeParse(payload.id.toString()).success){
          throw "Not allowed"
       }
        c.set("userId" , payload.id.toString());
        await next()
    }catch(err){
      // console.log(err)
      c.status(403)
       return c.json({
          error : "Some Error Occured at f1"
       })
    }
  })
  
blogRouter.use('/*' , async (c , next) => {
     try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL ,
        }).$extends(withAccelerate());
        const userId = c.get("userId");
        if(!tokenSchema.safeParse(userId).success){
          throw "Not allowed"
       }
        if(!userId){
            throw "Some Error Occured!";
        }
        
        const getUser = await prisma.user.findUnique({
           where : {
              id : userId
           }
        })
        if(!getUser || !getUser.id || getUser.id !== userId){
            c.status(404);
            return c.json({
                error : "User Not Found"
            })
        }
        // if(!userSchema.safeParse({...getUser }).success)throw "bad"
        await next();
     }catch(err){
        console.log("Here is Error " , err)
        c.status(403);
        return c.json({
          error : "Unable to verify User!"
        })
     }
  })
  
  blogRouter.get('/:token/:id', async (c) => {
     try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL ,
        }).$extends(withAccelerate());
        const authorId:(string | undefined) = c.req.param('id');
        if(!authorId)throw "Wtf"
        const blogs = await prisma.post.findMany({
            where : {
               authorId
            }
        })
        // console.log(blogs)
        return c.json({
            blogs
        })
     }catch(err){
        c.status(404);
        // console.log("here")
        return c.json({
            error : "NO such blog can be retreived"
        })
     }
    })
  blogRouter.get('/:token/me/get' , async (c) => {
    try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL ,
        }).$extends(withAccelerate());
      const posts = await prisma.post.findMany({
        where : {
           authorId : c.get("userId")
        }
      })
      // console.log("post " , post);
      return c.json({
          posts
      })
    }catch(err){
      c.status(403);
      return c.json({
          error : "Unable to Post Blog"
      })
    }
  })

const blogCreateSchema = zod.object({
    title: zod.string().min(1).max(30),
    content : zod.string().min(1).max(300),
    authorId : zod.string().min(1).max(70)
})

  blogRouter.post('/', async (c) => {
    try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL ,
        }).$extends(withAccelerate());
      const body = await c.req.json();
      if(!blogCreateSchema.safeParse({
        title : body.title,
        content : body.content,
        authorId : c.get("userId")
     }).success){
        throw "Not allowed"
     }
      const post = await prisma.post.create({
        data : {
           title : body.title,
           content : body.content,
           authorId : c.get("userId")
        }
      })
      // console.log("post " , post);
      return c.json({
          post
      })
    }catch(err){
      c.status(403);
      return c.json({
          error : "Unable to Post Blog"
      })
    }
  })
  
  blogRouter.put('/', async (c) => {
      try{
        const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL ,
          }).$extends(withAccelerate());
        const body = await c.req.json();
        if(!body)throw "Cannot Perform This Operation!"
        if(!blogCreateSchema.safeParse({
          title : body.title,
          content : body.content,
          authorId :  body.blogID
       }).success){
          throw "Not allowed"
       }
        const title:string = body.title;
        const content:string = body.content;
        const blogID:string = body.blogID;
        // console.log(title , content  , blogID)
        if(!title || !content || !blogID)throw "Missing Things";
        
        const newBlog = await prisma.post.update({
             where : {
                authorId : c.get("userId"),
                id : blogID
            } 
            ,data : {
                title,
                content
            }
        })
        return c.json({
          newBlog
        })
  
      }catch(err){
        // console.log("This")
        // console.log(err)
        c.status(403)
        return c.json({
          error : "Not Valid!"
        })
      }
  })


 
  