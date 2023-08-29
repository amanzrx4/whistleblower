import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 8000;

process.on("uncaughtException", function (err) {
  console.log("Uncaught exception: ", err);
});

app.get("/", (_, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("process", process.env.CALLBACK_URL);

  console.log(`Server is running at http://localhost:${port}`);
});
