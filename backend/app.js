import express from "express";
import cors from "cors";
import path from "path";

import { sendMsg } from "./connector.js";

const PORT = 8888;
const __dirname = path.resolve(path.dirname(""));
const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

app.post("/connector", (req, res) => {
	sendMsg(req.body.command);
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
