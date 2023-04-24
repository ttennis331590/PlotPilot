const express = require('express')
const app = express()
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const prisma = new PrismaClient();
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const diff = require('diff');
const mammoth = require('mammoth');
const axios = require("axios");


app.use(express.json());


const port = 3001

app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.body;
    const userDir = path.join('uploads', username);

    // Ensure the user directory exists
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  }
});


const upload = multer({ storage: storage });

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

app.post('/merge', (req, res) => {
  const { username, originalFile, newFile } = req.body;

  if (!username || !originalFile || !newFile) {
    return res.status(400).send('Username, originalFile, and newFile are required');
  }

  const userDir = path.join('uploads', username);

  const originalFilePath = path.join(userDir, originalFile);
  const newFilePath = path.join(userDir, `${originalFile}.newfile`);

  if (fs.existsSync(originalFilePath)) {
    fs.unlinkSync(originalFilePath);
  }

  fs.copyFileSync(newFilePath, originalFilePath);
  fs.unlinkSync(newFilePath);

  res.status(200).send('Files merged successfully');
});
function mergeDuplicateNames(list) {
  const data = JSON.parse(list);
  for (let i = 0; i < data.length; i++) {
    const currentDict = data[i];
    for (let j = i + 1; j < data.length; j++) {
      const nextDict = data[j];
      const commonWords = currentDict.word
        .split(" ")
        .filter((word) => nextDict.word.includes(word));
      if (commonWords.length > 0) {
        // Merge the two dictionaries
        data[i] = {
          ...currentDict,
          ...nextDict,
          word: [...new Set(currentDict.word.split(" ").concat(nextDict.word.split(" ")))].join(" ")
        };
        // Remove the next dictionary
        data.splice(j, 1);
        // Recheck the current dictionary against the rest of the list
        j--;
      }
    }
  }
  return data;
}

async function processFileContent(filePath, extension) {
  let fileContent;
  if (extension === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    fileContent = result.value;
    console.log("file content",fileContent);
  } else {
    fileContent = fs.readFileSync(filePath, 'utf-8');
  }
  return fileContent instanceof Buffer ? fileContent.toString() : fileContent;
}


app.post('/commit', upload.array('files'), async (req, res) => {
  const { username } = req.body;
  const files = req.files;

  console.log("Received username:", username);
  console.log("Received files:", files);

  if (!username || username.trim() === '' || files.length === 0) {
    return res.status(400).send('Username and files are required');
  }

  const userDir = path.join(__dirname, 'uploads', username);

  // Ensure the user directory exists
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  for (const file of files) {
    const originalFile = file.originalname;
    const originalFilePath = path.join(userDir, originalFile);
    const extension = path.extname(originalFile);
    const fileNameWithoutExtension = path.basename(originalFile, extension);
    const newFilePath = path.join(userDir, `${fileNameWithoutExtension}.newfile${extension}`);
    const diffFilePath = path.join(userDir, `${fileNameWithoutExtension}.diff.json`);

    

    if (fs.existsSync(originalFilePath)) {
      console.log("Original file exists:", originalFilePath)
      const oldFileContent = await processFileContent(originalFilePath, extension);
      const newFileContent = await processFileContent(file.path, extension);
      // const entities = await extractEntities(newFileContent);
      // // const entities_filtered = mergeDuplicateNames(entities);
      // console.log("entities",entities);
      

      const fileDiffs = diff.diffLines(oldFileContent, newFileContent);
      const diffData = fileDiffs.map((fileDiff) => ({
        added: fileDiff.added,
        removed: fileDiff.removed,
        value: fileDiff.value,
      }));

      fs.writeFileSync(diffFilePath, JSON.stringify(diffData, null, 2));
      fs.copyFileSync(file.path, newFilePath);
      console.log("Updated file and created diff file for:", originalFile);

    } else {
      console.log("Original file does not exist:", originalFile)
      fs.copyFileSync(file.path, originalFilePath); // Copy the original binary file instead
      console.log("Created new file:", originalFile);
    }
    // Delete the temporary file
    fs.unlinkSync(file.path);
  }

  res.status(200).send('Files processed');
});


async function extractEntities(file) {
  const response = await axios.post("http://0.0.0.0:3003/upload_file", file);
  return response.data;
}
  

app.get("/diffFile" , async (req, res) => {
  const { username, fileName } = req.query;
  const extension = path.extname(fileName);
  const fileNameNoExt = path.basename(fileName, extension);
  const userDir = path.join('uploads', username);
  const diffFilePath = path.join(userDir, `${fileNameNoExt}.diff.json`);
  console.log(diffFilePath, fs.existsSync(diffFilePath));
  
  if (fs.existsSync(diffFilePath)) {
    res.json(JSON.parse(fs.readFileSync(diffFilePath, 'utf-8')));
  } else {
    res.status(404).send('Diff file not found');
  }
});

app.get('/getDiff', async (req, res) => {
  const { username, fileName } = req.query;

  // Check for required parameters
  if (!username || !fileName) {
    return res.status(400).send('Username and fileName are required');
  }

  const userDir = path.join(__dirname, 'uploads', username);
  const extension = path.extname(fileName);
  const fileNameWithoutExtension = path.basename(fileName, extension);
  const diffFilePath = path.join(userDir, `${fileNameWithoutExtension}.diff.json`);

  // Check if the diff file exists
  if (!fs.existsSync(diffFilePath)) {
    return res.status(404).send('Diff file not found');
  }

  const diffData = JSON.parse(fs.readFileSync(diffFilePath, 'utf8'));
  res.json(diffData);
});

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

app.get("/currentPromptStories", async (req, res) => {
  const prompts = await prisma.story.findMany({
  where:{
    prompt:{
      currentPrompt: true,
    },
  },
  include: {
    prompt: true,
    author: true,
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

app.post('/appSync', upload.array('files', 10), (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  const userDir = path.join('uploads', username);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  req.files.forEach((file) => {
    fs.renameSync(file.path, path.join(userDir, file.originalname));
  });

  res.status(200).send('Files uploaded successfully');
});

app.get('/userInfo', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ username: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/userInfoId', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('id is required');
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ username: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/getFiles', async (req, res) => {
  console.log("getfiles hit")
  const username = req.query.username;
  if (!username) {
    return res.status(400).send('Username is required');
  }

  const userDir = path.join('uploads', username);
  const files = fs.readdirSync(userDir);
  console.log(files);

  for (i = 0; i < files.length; i++) {
    if (files[i].includes(".diff.json") || files[i].includes(".newfile.")) {
      files.splice(i, 1);
      console.log(files, i);
      i--;
    }
  }

  // Send the files back to the client
  res.status(200).json(files);
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
    console.log("liked!")
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/unlikePrompt', async (req, res) => {
  const { userId, promptId } = req.body;

  try {
    // Add the user to the prompt's likedByUsers list
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        numberLikes: {
          increment: -1,
        },
        likedByUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.sendStatus(200);
    console.log("unliked!")
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

