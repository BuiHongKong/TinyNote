const express = require("express");
const path = require("path");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const app = express();
app.use(express.json());

// 👉 serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

const TABLE = process.env.TABLE_NAME;

// API
app.get("/notes", async (req, res) => {
  const data = await db.send(
    new ScanCommand({ TableName: TABLE })
  );
  res.json(data.Items || []);
});

app.post("/notes", async (req, res) => {
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        id: randomUUID(),
        text: req.body.text,
        createdAt: Date.now()
      }
    })
  );
  res.json({ ok: true });
});

// React/Vite fallback - match tất cả GET requests chưa được định nghĩa
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

app.listen(3000, () => {
  console.log("TinyNote backend running on port 3000");
});
