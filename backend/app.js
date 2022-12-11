import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import { sendMsg } from "./connector.js";
import { addGradient, editGradient, removeGradient, applyGradient } from "./gradient.js";

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

app.post("/sendCommand", (req, res) => {
	sendMsg(req.body.command);
});

app.post("/addGradient", (req, res) => {
	addGradient(req.body);
});

app.post("/removeGradient", (req, res) => {
	removeGradient(req.body.gradient);
});

app.post("/editGradient", (req, res) => {
	editGradient(req.body);
});

app.post("/applyGradient", (req, res) => {
	applyGradient(req.body.gradient);
});

app.get("/getGradients", (req, res) => {
	fs.readFile("gradients.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		res.send(data);
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
