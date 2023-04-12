const express = require('express')
const app = express()
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const prisma = new PrismaClient();
const cors = require("cors");


app.use(express.json());


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
  const prompts = await prisma.prompt.findMany({
    where: {
      currentPrompt: true,
    },
    include: {
      user: true,
    }
  });
  console.log(prompts);
  res.json(prompts);
});



app.post("/signup", async (req, res) => {
  const { username, email: plainTextEmail, password: plainTextPassword } = req.body.requestBody;
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

app.post('/likePrompt', async (req, res) => {
  const { userId, promptId } = req.body;

  try {
    // Add the user to the prompt's likedByUsers list
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        numberLikes: {
          increment: 1,
        },
        likedByUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

  
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const secret = "temporarySecret";
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
    // Include userId and token in the response
    return res.json({ userId: user.id, token, message: "Login Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
  
  app.get("/protected", (req, res) => {
    // Get JWT token from cookie
    const secret = "temporarySecret";
    const token = req.cookies.token;
  
    if (!token) {
      // Token not found
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, secret);
      console.log(decoded);
      // Get user from database
      const user = prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        // User not found
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      // User is authenticated, return protected resource
      return res.redirect("/");
      
      
  
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  });

