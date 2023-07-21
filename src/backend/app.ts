import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import { addGradient, editGradient, removeGradient } from "./gradientManager";
import { Animator } from "./Animator";

const PORT = 8888;
const baseDirName = path.resolve(path.dirname(""));
const app = express();

const animator: Animator = new Animator();

const gradPath = path.join(baseDirName, "/src/backend", "gradients.json");
if (!fs.existsSync(gradPath)) {
	const content = "{}";

	fs.writeFileSync(gradPath, content);
	console.log(`File "${gradPath}" was created.`);
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

app.post("/command", (req: Request, res: Response) => {
	animator.switchAnimation(req.body.name, req.body.params);
	res.sendStatus(200);
});

app.post("/brightness", (req: Request, res: Response) => {
	animator.setBrightness(req.body.brightness);
	res.sendStatus(200);
});

app.post("/addGradient", (req: Request<{}, {}, string>, res: Response) => {
	addGradient(req.body);
	res.sendStatus(200);
});

app.post("/removeGradient", (req: Request, res: Response) => {
	removeGradient(req.body.gradient);
	res.sendStatus(200);
});

app.post("/editGradient", (req: Request, res: Response) => {
	editGradient(req.body);
	res.sendStatus(200);
});

app.post("/applyGradient", (req: Request, res: Response) => {
	animator.switchGradient(req.body.gradientName, req.body.currentAnimation);
	res.sendStatus(200);
});

app.get("/getGradients", (_req: Request, res: Response) => {
	fs.readFile(gradPath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			res.sendStatus(500); // Send a server error status code as a response
			return;
		}
		res.send(data);
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
