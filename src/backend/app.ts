import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import { addGradient, editGradient, removeGradient } from "./gradientManager";
import { handleCommand } from "./CommandHandler.js";
import { Animator } from "./Animator.js";

const PORT = 8888;
const baseDirName = path.resolve(path.dirname(""));
const app = express();

const animator: Animator = new Animator();

const gradPath = path.join(baseDirName, "/src/backend", "gradients.json");
if (!fs.existsSync(gradPath)) {
	const content = "{}";

	fs.writeFileSync(gradPath, content);
	console.log(`File "${gradPath} was created.`);
}

app.use(
	cors({
		origin: "http://localhost:" + PORT,
	})
);
app.use(express.json());
app.use(express.static(path.join(baseDirName, "../frontend")));

app.get("/", (_req: Request, res: Response) => {
	res.sendFile(path.join(baseDirName, "/src/frontend", "index.html"));
});

app.get("/libs/bootstrap-3.4.1-dist/css/bootstrap.css", (_req: Request, res: Response) => {
	res.sendFile(path.join(baseDirName, "libs/bootstrap-3.4.1-dist/css/bootstrap.css"));
});

app.get("/main.css", (_req: Request, res: Response) => {
	res.sendFile(path.join(baseDirName, "src/frontend/main.css"));
});

app.get("/dist/bundle.js", (_req: Request, res: Response) => {
	res.sendFile(path.join(baseDirName, "dist/bundle.js"));
});

app.post("/command", (req: Request) => {
	handleCommand(req.body.command, animator);
});

app.post("/addGradient", (req: Request<{}, {}, string>) => {
	addGradient(req.body);
});

app.post("/removeGradient", (req: Request) => {
	removeGradient(req.body.gradient);
});

app.post("/editGradient", (req: Request) => {
	editGradient(req.body);
});

app.post("/applyGradient", (req: Request) => {
	animator.switchGradient(req.body.name);
});

app.get("/getGradients", (_req: Request, res: Response) => {
	fs.readFile(gradPath, "utf8", (err, data) => {
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