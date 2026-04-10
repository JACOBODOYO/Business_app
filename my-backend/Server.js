const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
require("dotenv").config();
const path = require("path");
const app = express();
const port = 3001;
const jwtSecret = process.env.JWT_SECRET;

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

const AfricasTalking = require("africastalking");

const africasTalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = africasTalking.SMS;

module.exports = africasTalking

function formatKenyanNumber(phone) {
  // remove spaces
  let num = phone.replace(/\s/g, "");

  // convert 07XXXXXXXX → +2547XXXXXXXX
  if (num.startsWith("0")) {
    num = "+254" + num.substring(1);
  }

  // convert 2547XXXXXXXX → +2547XXXXXXXX
  if (num.startsWith("254")) {
    num = "+" + num;
  }

  return num;
}


// Middleware
//
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      //"https://jacobodoyo.github.io",
      //"https://business-kd766ajis-jacobodoyos-projects.vercel.app",
      //"https://business-app-lac.vercel.app",
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
  database: "postgres",
  password: process.env.DB_PASSWORD,
  port: 5432,
});



// ---------------------- AUTH ----------------------
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Helper to check if a column exists on a table
    const hasColumn = async (table, col) => {
      const r = await pool.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`,
        [table, col]
      );
      return r.rows.length > 0;
    };

    let user = null;

    // Try admin table only if it has an email or name column
    const adminHasEmail = await hasColumn('admin', 'email');
    const adminHasName = await hasColumn('admin', 'name');

    if (adminHasEmail) {
      const result = await pool.query(
        "SELECT id, email, password, 'admin' AS role FROM admin WHERE email = $1",
        [email]
      );
      user = result.rows[0];
    } else if (adminHasName) {
      const result = await pool.query(
        "SELECT id, name as email, password, 'admin' AS role FROM admin WHERE name = $1",
        [email]
      );
      user = result.rows[0];
    }

    // If not found in admin, try users table (check available columns first)
    if (!user) {
      const usersHasEmail = await hasColumn('users', 'email');
      const usersHasName = await hasColumn('users', 'name');

      if (usersHasEmail) {
        const result = await pool.query(
          "SELECT id, email, password, role FROM users WHERE email = $1",
          [email]
        );
        user = result.rows[0];
      } else if (usersHasName) {
        const result = await pool.query(
          "SELECT id, name as email, password, role FROM users WHERE name = $1",
          [email]
        );
        user = result.rows[0];
      }
    }

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role || "user",
        },
        jwtSecret,
        { expiresIn: "1h" }
      );

      res.json({ loginStatus: true, token });
    } else {
      res.json({ loginStatus: false, error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/users", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: only admins can add users" });
  }
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
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

app.post("/payments", async (req, res) => {
  const { lead_id, amount, payment_date, notes } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO payments (lead_id, amount, payment_date, notes)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [lead_id, amount, payment_date, notes]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/send-sms", async (req, res) => {
  const { phone, message } = req.body;

  try {

    if (!phone || !message) {
      return res.status(400).json({ error: "Phone and message required" });
    }

    const formattedPhone = phone.replace(/^0/, "254");

    const result = await sms.send({
      to: [formattedPhone],
      message: message,
    });

    res.json(result);

  } catch (error) {

    console.error("SMS ERROR:", error.response?.data || error);

    res.status(500).json({
      error: "SMS failed",
      details: error.response?.data || error.message
    });

  }
});

app.post("/make-call", async (req, res) => {
  try {
    let { phoneNumber } = req.body;

    // format number
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "+254" + phoneNumber.substring(1);
    }

    const voice = africasTalking.VOICE;

    const response = await voice.call({
      callFrom: process.env.AT_PHONE_NUMBER,
      callTo: [phoneNumber],
    });

    res.json(response);
  } catch (error) {
    console.error("CALL ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});;


// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1]; // remove "Bearer"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


// ---------------------- LEADS ----------------------

// Get all leads
app.get("/leads", authenticateToken, async (req, res) => {
  try {
    let result;

    if (req.user.role === "admin") {
      result = await pool.query("SELECT * FROM leads ORDER BY id DESC");
    } else {
      result = await pool.query(
        "SELECT * FROM leads WHERE assigned_to = $1 ORDER BY id DESC",
        [req.user.id]
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});


// Get a specific lead by ID
app.get("/leads/:leadId", async (req, res) => {
  const { leadId } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT 
        leads.*,
        users.name AS agent_name
      FROM leads
      LEFT JOIN users 
      ON leads.assigned_to = users.id
      WHERE leads.id = $1
      `,
      [leadId]
    );

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

// Get all users (Admin only ideally)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/clients", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT company 
      FROM leads
      WHERE company IS NOT NULL
      AND TRIM(company) <> ''
      ORDER BY company ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/monthly-collections", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        users.name,
        SUM(leads.amount_paid) AS total_collected
      FROM leads
      JOIN users ON users.id = leads.assigned_to
      WHERE DATE_TRUNC('month', leads.payment_date) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY users.name
      ORDER BY total_collected DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching monthly collections:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/dashboard-summary", async (req, res) => {
  try {

    const portfolio = await pool.query(`
      SELECT 
        SUM(amount) AS total_portfolio,
        SUM(amount_paid) AS total_collected
      FROM leads
    `)

    const today = await pool.query(`
      SELECT SUM(amount_paid) AS today_collections
      FROM leads
      WHERE payment_date = CURRENT_DATE
    `)

    const users = await pool.query(`
      SELECT users.name, SUM(leads.amount_paid) AS collected
      FROM leads
      JOIN users ON users.id = leads.assigned_to
      GROUP BY users.name
      ORDER BY collected DESC
    `)

    const daily = await pool.query(`
      SELECT payment_date, SUM(amount_paid) AS total
      FROM leads
      WHERE payment_date IS NOT NULL
      GROUP BY payment_date
      ORDER BY payment_date
    `)

    res.json({
      portfolio: portfolio.rows[0],
      today: today.rows[0],
      users: users.rows,
      daily: daily.rows
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

app.get("/recent-payments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT title, amount_paid, payment_date
      FROM leads
      WHERE payment_date IS NOT NULL
      ORDER BY payment_date DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recent payments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/payments/:leadId", async (req, res) => {

  const { leadId } = req.params;

  try {

    const result = await pool.query(
      `SELECT * FROM payments
       WHERE lead_id=$1
       ORDER BY payment_date DESC`,
      [leadId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/top-collectors", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        users.id,
        users.name,
        COALESCE(SUM(payments.amount),0) AS total_collected,
        COALESCE(SUM(leads.amount_paid),0) AS total
      FROM users
      LEFT JOIN leads
        ON leads.assigned_to = users.id
      LEFT JOIN payments
        ON payments.lead_id = leads.id
      GROUP BY users.id
      ORDER BY total DESC
      LIMIT 5
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/leads/:leadId/activity", async (req, res) => {
  const { leadId } = req.params;

  try {

    const payments = await pool.query(
      `SELECT 
        payment_date AS date,
        'payment' AS type,
        amount,
        'Payment received' AS description
       FROM payments
       WHERE lead_id = $1`,
      [leadId]
    );

    const followups = await pool.query(
      `SELECT 
        next_action_date AS date,
        'followup' AS type,
        notes AS description
       FROM followups
       WHERE lead_id = $1`,
      [leadId]
    );

    const notes = await pool.query(
      `SELECT 
        created_at AS date,
        'note' AS type,
        content AS description
       FROM notes
       WHERE lead_id = $1`,
      [leadId]
    );

    const activity = [
      ...payments.rows,
      ...followups.rows,
      ...notes.rows
    ];

    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activity);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/ptp-today", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT leads.id, leads.company, promise_to_pay.amount, promise_to_pay.promise_date
      FROM promise_to_pay
      JOIN leads ON leads.id = promise_to_pay.lead_id
      WHERE promise_to_pay.promise_date = CURRENT_DATE
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/broken-ptp", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT leads.id, leads.company, promise_to_pay.promise_date, promise_to_pay.amount
      FROM promise_to_pay
      JOIN leads ON leads.id = promise_to_pay.lead_id
      WHERE promise_to_pay.promise_date < CURRENT_DATE
      AND promise_to_pay.status != 'paid'
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

});

app.get("/dashboard/no-contact", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT leads.id, leads.company, MAX(followups.next_action_date) AS last_contact
      FROM leads
      LEFT JOIN followups ON leads.id = followups.lead_id
      GROUP BY leads.id
      HAVING MAX(followups.next_action_date) < CURRENT_DATE - INTERVAL '7 days'
      OR MAX(followups.next_action_date) IS NULL
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

});

app.get("/dashboard/high-value", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT id, company, amount
      FROM leads
      ORDER BY amount DESC
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

});

app.get("/dashboard/daily-collections", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        payment_date,
        SUM(amount) as total
      FROM payments
      GROUP BY payment_date
      ORDER BY payment_date
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/agent-performance", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT client_id, COUNT(*) as total_calls
      FROM calls
      GROUP BY client_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/dashboard/recovery-rate", async (req, res) => {

  try {

    const totalPortfolio = await pool.query(`
      SELECT SUM(amount) as total FROM leads
    `);

    const totalCollected = await pool.query(`
      SELECT SUM(amount) as collected FROM payments
    `);

    const portfolio = totalPortfolio.rows[0].total || 0;
    const collected = totalCollected.rows[0].collected || 0;

    const recoveryRate = (collected / portfolio) * 100;

    res.json({
      portfolio,
      collected,
      recoveryRate
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }

});

app.post("/promise-to-pay", authenticateToken, async (req, res) => {
  const { lead_id, promised_amount, promised_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO promise_to_pay 
       (lead_id, amount, promise_date, user_id)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [lead_id, promised_amount, promised_date, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving PTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/promise-to-pay/:leadId", authenticateToken, async (req, res) => {
  const { leadId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        id,
        amount,
        promise_date,
        status,
        created_at
       FROM promise_to_pay
       WHERE lead_id = $1
       ORDER BY promise_date DESC`,
      [leadId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching PTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/reports/monthly-payments",authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', payments.payment_date) AS month,
        users.name AS user,
        SUM(payments.amount) AS total
      FROM payments
      JOIN leads ON leads.id = payments.lead_id
      JOIN users ON users.id = leads.assigned_to
      GROUP BY month, users.name
      ORDER BY month DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching monthly payments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/leads/payment/:id", upload.single("proof"), async (req, res) => {
  try {

    const { id } = req.params;
    const { amount_paid, payment_date } = req.body;
    const proof = req.file ? req.file.filename : null;

    const result = await pool.query(
      `UPDATE leads
       SET amount_paid = COALESCE(amount_paid,0) + $1,
           payment_date = $2,
           payment_proof = $3
       WHERE id = $4
       RETURNING *`,
      [amount_paid, payment_date, proof, id]
    );

    await pool.query(
      `INSERT INTO payments (lead_id, amount, payment_date, notes)
       VALUES ($1, $2, $3, $4)`,
      [id, amount_paid, payment_date, "Payment uploaded"]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Payment upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
});




// Add a single lead
app.post("/leads", authenticateToken, async (req, res) => {
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
app.post("/notes", authenticateToken, async (req, res) => {
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

app.post("/upload-leads", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 🔥 Helpers
    const safeDate = (value) => {
      if (!value || value === "") return null;
      return value;
    };

    const toNumber = (value) => {
      if (value === "" || value === null || value === undefined) return 0;
      return Number(value);
    };

    const toBigIntSafe = (value) => {
      if (!value) return null;
      return value.toString(); // safer if column is TEXT
    };

    let success = 0;
    let failed = 0;

    for (const row of data) {
      try {
        await pool.query(
          `INSERT INTO leads (
            company, title, phone, mail, address, deal_stage, product, tags,
            interest, probability, username, next_followup, next_activity,
            amount, amount_paid, account_open_date, cust_id, id,
            assigned_to, payment_date, payment_proof
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
          )`,
          [
            row.company || "",
            row.title || "",
            row.phone || "",
            row.mail || "",
            row.address || "",
            row.deal_stage || "",
            row.product || "",
            row.tags || "",
            toNumber(row.interest),
            toBigIntSafe(row.probability), // ✅ FIXED
            row.username || "",
            safeDate(row.next_followup),
            row.next_activity || "",
            toNumber(row.amount),
            toNumber(row.amount_paid),
            safeDate(row.account_open_date),
            row.CUST_ID || null,
            row.id || null,
            row.assigned_to || null,
            safeDate(row.payment_date), // ✅ FIXED
            row.payment_proof || null,
          ]
        );

        success++;
      } catch (err) {
        console.error("Row failed:", row, err.message);
        failed++;
      }
    }

    res.json({
      message: "Upload complete",
      success,
      failed,
      total: data.length,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
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
