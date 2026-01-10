const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
const port = 3001;
const jwtSecret = process.env.JWT_SECRET;

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jacobodoyo.github.io",
      "https://business-kd766ajis-jacobodoyos-projects.vercel.app",
      "https://business-app-lac.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jamatel",
  password: "5657",
  port: 5432,
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;

const client = twilio(accountSid, authToken);

// ---------------------- AUTH ----------------------
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
        expiresIn: "1h",
      });
      res.json({ loginStatus: true, token });
    } else {
      res.json({ loginStatus: false, error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/followups", async (req, res) => {
  const { lead_id, followup_type, notes, next_action_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO followups (lead_id, followup_type, notes, next_action_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [lead_id, followup_type, notes, next_action_date]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving follow-up" });
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

// ---------------------- LEADS ----------------------

// Get all leads
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads ORDER BY company ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get a specific lead by ID
app.get("/leads/:leadId", async (req, res) => {
  const { leadId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM leads WHERE id = $1", [
      leadId,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/followups/:lead_id", async (req, res) => {
  const { lead_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM followups
       WHERE lead_id = $1
       ORDER BY created_at DESC`,
      [lead_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching follow-ups" });
  }
});

// Endpoint to generate Twilio capability token
app.get("/token", (req, res) => {
  try {
    const { identity } = req.query; // agent username or ID
    if (!identity) return res.status(400).json({ error: "Identity is required" });

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create an access token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity } // the agent's identity
    );

    // Grant access to Twilio Voice
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID, // your TwiML App SID
      incomingAllow: true, // allow incoming calls
    });

    token.addGrant(voiceGrant);

    // Return JWT to client
    res.json({ token: token.toJwt() });
  } catch (error) {
    console.error("Error generating Twilio token:", error);
    res.status(500).json({ error: "Failed to generate Twilio token" });
  }
});



// Add a single lead
app.post("/leads", async (req, res) => {
  const {
    company,
    title,
    phone,
    mail,
    address,
    deal_stage,
    product,
    tags,
    interest,
    probability,
    username,
    next_followup,
    next_activity,
    amount,
    amount_paid,
    account_open_date,
    CUST_ID,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO leads
      (company, title, phone, mail, address, deal_stage, product, tags, interest, probability, username, next_followup, next_activity, amount, amount_paid, account_open_date, CUST_ID)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *`,
      [
        company,
        title,
        phone,
        mail,
        address,
        deal_stage,
        product,
        tags,
        interest || 0,
        probability || 0,
        username,
        next_followup,
        next_activity,
        amount || 0,
        amount_paid || 0,
        account_open_date || new Date(),
        CUST_ID || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding lead:", err);
    res.status(500).json({ error: "Failed to add lead" });
  }
});

// Bulk upload leads from Excel
app.post("/leads/bulk", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const insertValues = rows.map((row) => [
      row.Company || "",
      row.Name || "",
      row.Phone || "",
      row.Mail || "",
      row.Address || "",
      row.DealStage || "",
      row.Product || "",
      row.Tags || "",
      row.Interest || 0,
      row.Probability || 0,
      row.Username || "",
      row.NextFollowup || "",
      row.NextActivity || "",
      row.Amount || 0,
      row.AmountPaid || 0,
      row.AccountOpenDate || new Date(),
      row.CUST_ID || null,
    ]);

    const queryText = `
      INSERT INTO leads
      (company, title, phone, mail, address, deal_stage, product, tags, interest, probability, username, next_followup, next_activity, amount, amount_paid, account_open_date, CUST_ID)
      VALUES
      ${insertValues.map(
        (_, i) =>
          `(${Array(17)
            .fill(0)
            .map((__, j) => `$${i * 17 + j + 1}`)
            .join(",")})`
      )}
      RETURNING *`;

    const flatValues = insertValues.flat();

    const result = await pool.query(queryText, flatValues);

    res.status(201).json({ message: "Leads uploaded successfully", count: result.rowCount });
  } catch (error) {
    console.error("Error uploading leads:", error);
    res.status(500).json({ error: "Failed to upload leads" });
  }
});

// ---------------------- NOTES ----------------------
app.post("/notes", async (req, res) => {
  const { lead_id, text } = req.body;

  if (!lead_id || !text) {
    return res.status(400).json({ error: "Lead ID and text are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (lead_id, content) VALUES ($1, $2) RETURNING *",
      [lead_id, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to save note:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Get notes for a lead
app.get("/notes/:leadId", async (req, res) => {
  const { leadId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE lead_id = $1 ORDER BY created_at ASC",
      [leadId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------- SERVER ----------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
