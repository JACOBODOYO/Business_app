const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3001;

const jwtSecret = process.env.JWT_SECRET;



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jacobodoyo.github.io",
      "https://business-kd766ajis-jacobodoyos-projects.vercel.app",
      'https://business-app-lac.vercel.app',
    ], // Replace with your React app's URL
    credentials: true,
  })
);
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jamatel",
  password: "5657",
  port: 5432,
});

const plainPassword = "5657";

// Hash the password
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hash);

    // Compare the password
    bcrypt.compare(plainPassword, hash, (err, result) => {
      if (err) {
        console.error("Error comparing password:", err);
      } else {
        console.log("Password Match Result:", result); // Should log 'true'
      }
    });
  }
});

async function rehashAndStorePassword(email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log("New Hashed Password:", hashedPassword);

    // Update the database with the new hashed password
    await pool.query("UPDATE admin SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);
    console.log("Password updated in the database.");
  } catch (error) {
    console.error("Error rehashing and storing password:", error);
  }
}

rehashAndStorePassword("jacob@konekt.com", "5657");

// Endpoint to fetch leads
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch a lead by ID
app.get("/leads/:leadId", async (req, res) => {
  const { leadId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM leads WHERE id = $1", [
      leadId,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the first matching lead
    } else {
      res.status(404).json({ error: "Lead not found" }); // Return 404 if not found
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (user) {
      console.log("User found:", user);

      // Log the plain password and the hashed password
      console.log("Entered Password:", password);
      console.log("Stored Hashed Password:", user.password);

      const match = await bcrypt.compare(password, user.password);

      console.log("Password Match Result:", match); // Log the result of the password comparison

      if (match) {
        // Create a JWT
        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
          expiresIn: "1h",
        });
        res.json({ loginStatus: true, token });
      } else {
        res.json({ loginStatus: false, error: "Invalid credentials" });
      }
    } else {
      res.json({ loginStatus: false, error: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
