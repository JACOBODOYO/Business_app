require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./lib/supabase");
// const { Pool } = require("pg");
//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
//const decoded = jwt.decode(token);

const path = require("path");
const app = express();
const port = process.env.PORT || 3001;
//const jwtSecret = process.env.JWT_SECRET;

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
      "https://jacobodoyo.github.io",
      "https://jacobodoyo.github.io/Business_app",
      "https://business-app-pvy8-git-main-jacobodoyos-projects.vercel.app",
      //"https://business-app-lac.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });


// ---------------------- AUTH ----------------------
// app.post("/auth/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {

//     // Login using Supabase Auth
//     const { data, error } =
//       await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//     if (error) {
//       return res.status(401).json({
//         loginStatus: false,
//         error: error.message,
//       });
//     }

//     // Get extra user details from your users table
//     const { data: profile, error: profileError } =
//       await supabase
//         .from("users")
//         .select("*")
//         .eq("email", email)
//         .single();

//     if (profileError) {
//       console.error(profileError);
//     }

//     res.json({
//       loginStatus: true,
//       token: data.session.access_token,
//       user: {
//         id: data.user.id,
//         email: data.user.email,
//         role: profile?.role || "user",
//         name: profile?.name || "",
//       },
//     });

//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       loginStatus: false,
//       error: "Server error",
//     });
//   }
// });

app.post("/users", authenticateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
      });
    }

    // Save extra profile data
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create user",
    });
  }
});


app.post("/followups", async (req, res) => {
  const { lead_id, followup_type, notes, next_action_date } = req.body;

  try {
    const { data, error } = await supabase
      .from("followups")
      .insert([
        {
          lead_id,
          followup_type,
          notes,
          next_action_date,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error saving follow-up",
    });
  }
});

app.post("/payments", authenticateToken, async (req, res) => {
  const { lead_id, amount, payment_date, notes } = req.body;

  try {

    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          lead_id,
          amount,
          payment_date,
          notes,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
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
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // get role from YOUR users table (not auth table)
    const { data: adminUser, error: adminError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", data.user.email)
      .maybeSingle();

    req.user = {
  id: data.user.id,
  email: data.user.email,
  role: adminUser ? "admin" : "user",
};

    next();
    console.log(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication failed" });
  }
}


// ---------------------- LEADS ----------------------

// Get all leads
app.get("/leads", authenticateToken, async (req, res) => {
  try {

    let query = supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    // non-admin only sees assigned leads
    // if (req.user.role !== "admin") {
    //   query = query.eq("cust_id", req.user.id);
    // }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch leads",
    });
  }
});


// Get a specific lead by ID
app.get("/leads/:leadId", async (req, res) => {
  const { leadId } = req.params;

  try {

    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        users(name)
      `)
      .eq("id", leadId)
      .single();

    if (error) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

app.get("/followups/:lead_id", async (req, res) => {
  const { lead_id } = req.params;

  try {

    const { data, error } = await supabase
      .from("followups")
      .select("*")
      .eq("lead_id", lead_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error fetching follow-ups",
    });
  }
});

// Get all users (Admin only ideally)
app.get("/users", authenticateToken, async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

app.get("/clients", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("company")
      .not("company", "is", null)
      .order("company", { ascending: true });

    if (error) {
      throw error;
    }

    const uniqueCompanies = [
      ...new Map(
        data
          .filter(item => item.company?.trim() !== "")
          .map(item => [item.company, item])
      ).values()
    ];

    res.json(uniqueCompanies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/monthly-collections", async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("leads")
      .select(`
        amount_paid,
        payment_date,
        users(name)
      `);

    if (error) throw error;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const grouped = {};

    data.forEach((lead) => {
      if (!lead.payment_date) return;

      const paymentDate = new Date(lead.payment_date);

      if (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      ) {
        const name = lead.users?.name || "Unknown";

        grouped[name] =
          (grouped[name] || 0) + Number(lead.amount_paid || 0);
      }
    });

    const result = Object.entries(grouped).map(([name, total]) => ({
      name,
      total_collected: total,
    }));

    result.sort((a, b) => b.total_collected - a.total_collected);

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

app.get("/dashboard-summary", async (req, res) => {
  try {

    const { data: leads, error } = await supabase
      .from("leads")
      .select("*");

    if (error) throw error;

    const total_portfolio = leads.reduce(
      (sum, lead) => sum + Number(lead.amount || 0),
      0
    );

    const total_collected = leads.reduce(
      (sum, lead) => sum + Number(lead.amount_paid || 0),
      0
    );

    const todayDate = new Date().toISOString().split("T")[0];

    const today_collections = leads
      .filter((lead) => lead.payment_date === todayDate)
      .reduce((sum, lead) => sum + Number(lead.amount_paid || 0), 0);

    res.json({
      portfolio: {
        total_portfolio,
        total_collected,
      },
      today: {
        today_collections,
      },
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error",
    });

  }
});

app.get("/recent-payments", async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("leads")
      .select("title, amount_paid, payment_date")
      .not("payment_date", "is", null)
      .order("payment_date", { ascending: false })
      .limit(5);

    if (error) throw error;

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Server error",
    });

  }
});

app.get("/payments/:leadId", async (req, res) => {

  const { leadId } = req.params;

  try {

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("lead_id", leadId)
      .order("payment_date", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error",
    });

  }
});
app.get("/dashboard/top-collectors", async (req, res) => {
  try {
    // 1. Get payments + linked leads (assigned user)
    const { data, error } = await supabase
      .from("payments")
      .select(`
        amount,
        leads (
          assigned_to,
          users (
            id,
            name
          )
        )
      `);

    if (error) throw error;

    // 2. Aggregate in JS
    const map = {};

    data.forEach((p) => {
      const user = p.leads?.users;

      if (!user) return;

      const userId = user.id;
      const userName = user.name;

      if (!map[userId]) {
        map[userId] = {
          id: userId,
          name: userName,
          total_collected: 0,
        };
      }

      map[userId].total_collected += Number(p.amount || 0);
    });

    // 3. Convert to array + sort
    const result = Object.values(map)
      .sort((a, b) => b.total_collected - a.total_collected)
      .slice(0, 5);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/leads/:leadId/activity", async (req, res) => {
  const { leadId } = req.params;

  try {
    // 1. Payments
    const { data: payments, error: payErr } = await supabase
      .from("payments")
      .select("payment_date, amount")
      .eq("lead_id", leadId);

    if (payErr) throw payErr;

    // 2. Followups
    const { data: followups, error: followErr } = await supabase
      .from("followups")
      .select("next_action_date, notes")
      .eq("lead_id", leadId);

    if (followErr) throw followErr;

    // 3. Notes
    const { data: notes, error: notesErr } = await supabase
      .from("notes")
      .select("created_at, content")
      .eq("lead_id", leadId);

    if (notesErr) throw notesErr;

    // 4. Normalize into unified activity timeline
    const activity = [
      ...(payments || []).map((p) => ({
        date: p.payment_date,
        type: "payment",
        amount: p.amount,
        description: "Payment received",
      })),

      ...(followups || []).map((f) => ({
        date: f.next_action_date,
        type: "followup",
        description: f.notes,
      })),

      ...(notes || []).map((n) => ({
        date: n.created_at,
        type: "note",
        description: n.content,
      })),
    ];

    // 5. Sort newest first
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activity);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/ptp-today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("promise_to_pay")
      .select(`
        amount,
        promise_date,
        leads (
          id,
          company
        )
      `)
      .eq("promise_date", today);

    if (error) throw error;

    const result = (data || []).map((ptp) => ({
      id: ptp.leads?.id,
      company: ptp.leads?.company,
      amount: ptp.amount,
      promise_date: ptp.promise_date,
    }));

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/broken-ptp", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("promise_to_pay")
      .select(`
        amount,
        promise_date,
        status,
        leads (
          id,
          company
        )
      `)
      .lt("promise_date", today)
      .neq("status", "paid");

    if (error) throw error;

    const result = (data || []).map((ptp) => ({
      id: ptp.leads?.id,
      company: ptp.leads?.company,
      amount: ptp.amount,
      promise_date: ptp.promise_date,
    }));

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/no-contact", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("followups")
      .select(`
        lead_id,
        next_action_date,
        leads (
          id,
          company
        )
      `);

    if (error) throw error;

    const map = {};

    data.forEach((f) => {
      const lead = f.leads;
      if (!lead) return;

      const leadId = lead.id;

      const date = f.next_action_date
        ? new Date(f.next_action_date)
        : null;

      if (!map[leadId]) {
        map[leadId] = {
          id: leadId,
          company: lead.company,
          last_contact: date,
        };
      } else {
        if (
          date &&
          (!map[leadId].last_contact ||
            date > map[leadId].last_contact)
        ) {
          map[leadId].last_contact = date;
        }
      }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = Object.values(map)
      .filter((l) => {
        return (
          !l.last_contact || l.last_contact < sevenDaysAgo
        );
      })
      .slice(0, 10);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/high-value", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("id, company, amount")
      .order("amount", { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/dashboard/daily-collections", async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("payments")
      .select("payment_date, amount");

    if (error) throw error;

    const grouped = {};

    data.forEach((payment) => {
      const date = payment.payment_date;

      grouped[date] =
        (grouped[date] || 0) + Number(payment.amount || 0);
    });

    const result = Object.entries(grouped).map(([payment_date, total]) => ({
      payment_date,
      total,
    }));

    result.sort(
      (a, b) =>
        new Date(a.payment_date) - new Date(b.payment_date)
    );

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).send("Server error");

  }
});

app.get("/dashboard/agent-performance", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("calls")
      .select("client_id");

    if (error) throw error;

    const grouped = {};

    (data || []).forEach((call) => {
      if (!call.client_id) return;

      grouped[call.client_id] =
        (grouped[call.client_id] || 0) + 1;
    });

    const result = Object.entries(grouped).map(
      ([client_id, total_calls]) => ({
        client_id,
        total_calls,
      })
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/dashboard/recovery-rate", async (req, res) => {
  try {
    const { data: leadsData, error: leadsError } = await supabase
      .from("leads")
      .select("amount");

    if (leadsError) throw leadsError;

    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payments")
      .select("amount");

    if (paymentsError) throw paymentsError;

    const portfolio = (leadsData || []).reduce(
      (sum, l) => sum + Number(l.amount || 0),
      0
    );

    const collected = (paymentsData || []).reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const recoveryRate =
      portfolio > 0 ? (collected / portfolio) * 100 : 0;

    res.json({
      portfolio,
      collected,
      recoveryRate,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/promise-to-pay", authenticateToken, async (req, res) => {
  const { lead_id, promised_amount, promised_date } = req.body;

  try {
    const { data, error } = await supabase
      .from("promise_to_pay")
      .insert([
        {
          lead_id,
          amount: promised_amount,
          promise_date: promised_date,
          user_id: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.error("Error saving PTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/promise-to-pay/:leadId", authenticateToken, async (req, res) => {
  const { leadId } = req.params;

  try {
    const { data, error } = await supabase
      .from("promise_to_pay")
      .select("id, amount, promise_date, status, created_at")
      .eq("lead_id", leadId)
      .order("promise_date", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching PTP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/reports/monthly-payments", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("monthly_payments_report")
      .select("*");

    if (error) throw error;

    res.json(data);
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

    // 1. Get current lead first (needed for increment logic)
    const { data: existingLead, error: fetchError } = await supabase
      .from("leads")
      .select("amount_paid")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const newAmount =
      (Number(existingLead.amount_paid) || 0) + Number(amount_paid);

    // 2. Update lead
    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        amount_paid: newAmount,
        payment_date,
        payment_proof: proof,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Insert payment record
    const { error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          lead_id: id,
          amount: amount_paid,
          payment_date,
          notes: "Payment uploaded",
        },
      ]);

    if (paymentError) throw paymentError;

    res.json(updatedLead);
  } catch (error) {
    console.error("Payment upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/leads/:id", async (req, res) => {
  const { id } = req.params;
  const { next_followup } = req.body;

  try {
    const { data, error } = await supabase
      .from("leads")
      .update({ next_followup })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
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
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          company,
          title,
          phone,
          mail,
          address,
          deal_stage,
          product,
          tags,
          interest: interest || 0,
          probability: probability || 0,
          username,
          next_followup,
          next_activity,
          amount: amount || 0,
          amount_paid: amount_paid || 0,
          account_open_date: account_open_date || new Date(),
          CUST_ID: CUST_ID || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Error adding lead:", err);
    res.status(500).json({ error: "Failed to add lead" });
  }
});

// Bulk upload leads from Excel
app.post("/leads/bulk", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const formattedRows = rows.map((row) => ({
      company: row.Company || "",
      title: row.Name || "",
      phone: row.Phone || "",
      mail: row.Mail || "",
      address: row.Address || "",
      deal_stage: row.DealStage || "",
      product: row.Product || "",
      tags: row.Tags || "",
      interest: row.Interest || 0,
      probability: row.Probability || 0,
      username: row.Username || "",
      next_followup: row.NextFollowup || null,
      next_activity: row.NextActivity || "",
      amount: row.Amount || 0,
      amount_paid: row.AmountPaid || 0,
      account_open_date: row.AccountOpenDate || new Date(),
      CUST_ID: row.CUST_ID || null,
    }));

    // Supabase supports bulk insert directly
    const { data, error } = await supabase
      .from("leads")
      .insert(formattedRows)
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Leads uploaded successfully",
      count: data.length,
    });
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
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          lead_id,
          content: text,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
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

    const safeDate = (value) =>
      !value || value === "" ? null : value;

    const toNumber = (value) =>
      value === "" || value === null || value === undefined
        ? 0
        : Number(value);

    const toBigIntSafe = (value) =>
      !value ? null : value.toString();

    const formatted = data.map((row) => ({
      company: row.company || "",
      title: row.title || "",
      phone: row.phone || "",
      mail: row.mail || "",
      address: row.address || "",
      deal_stage: row.deal_stage || "",
      product: row.product || "",
      tags: row.tags || "",
      interest: toNumber(row.interest),
      probability: toBigIntSafe(row.probability),
      username: row.username || "",
      next_followup: safeDate(row.next_followup),
      next_activity: row.next_activity || "",
      amount: toNumber(row.amount),
      amount_paid: toNumber(row.amount_paid),
      account_open_date: safeDate(row.account_open_date),
      cust_id: row.CUST_ID || null,
      id: row.id || null,
      assigned_to: row.assigned_to || null,
      payment_date: safeDate(row.payment_date),
      payment_proof: row.payment_proof || null,
    }));

    // batch insert (avoid Supabase limits)
    const chunkSize = 500;
    let success = 0;
    let failed = 0;

    for (let i = 0; i < formatted.length; i += chunkSize) {
      const chunk = formatted.slice(i, i + chunkSize);

      const { error } = await supabase.from("leads").insert(chunk);

      if (error) {
        console.error("Batch failed:", error.message);
        failed += chunk.length;
      } else {
        success += chunk.length;
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

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Internal server error",
    });

  }
});

// ---------------------- SERVER ----------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

