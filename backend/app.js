const express = require('express')
const app = express()
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const prisma = new PrismaClient();
const cors = require("cors");

const port = 3001

app.use(cors());

// Add CORS header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.get("/currentPrompts", async (req, res) => {
    const prompts = await prisma.prompt.findMany();
    res.json(prompts);
    });

app.post("/signup", async (req, res) => {
    const { username, plainTextEmail, plainTextPassword } = req.body;
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    const email = plainTextEmail;
    try {
      console.log("creating user");
      const user = await prisma.user.create({
        data: {
          name: username,
          email: email,
          password: hashedPassword,
        },
      });
      res.json({ user });
      console.log(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Cannot create user" });
    }
  });
  
  app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const secret = "americana1";
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // User not found
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const passwordMatchesHash = await bcrypt.compare(password, user.password);
      if (!passwordMatchesHash) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const token = jwt.sign({ userId: user.id }, secret);
  
      res.cookie("token", token, { httpOnly: true, maxAge: 31536000000 });
      return res.json({ message: "Login Successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });