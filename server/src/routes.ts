import {Router} from "express";

const router = Router()

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post('/api/login',(req,res)=>{
  const {email, password} = req.body

  res.json({
    message: 'success',
    email,password
  })
})

router.post('/api/signup',(req,res)=>{
  const {firstName,lastName,username,email, password,confirmPassword} = req.body

  res.json({
    message: 'success',
    email,password
  })
})

export default router