import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { v4 as randomId } from "uuid";
import Submissions from "./models";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL as string;
app.use(express.json());
app.use(cors());

const RECLAIM_APP_URL = "https://share.reclaimprotocol.org";

enum SubmissionStatus {
  pending = "pending",
  completed = "completed",
}
process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION:\t", err);
});

app.get("/hello", (req, res) => {
  res.status(200).send("Hello World");
});

app.get("/whistleblow", async (_: Request, res: Response) => {
  try {
    const query = await Submissions.find({});

    const filteredQuery = query.filter(
      (i) => i.message && i.proof && i.proofHash && i.sessionId
    );

    res.status(200).send({
      data: filteredQuery,
      message: "success",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
});

app.post("/generate", async (req: Request, res: Response) => {
  const sessionId = randomId();

  await Submissions.create({
    sessionId,
  }).catch((e) => {
    res.status(500).send({
      message: "Something went wrong",
    });
    return;
  });

  const templateUrl =
    RECLAIM_APP_URL +
    "/" +
    "selectLinks" +
    "/" +
    encodeURIComponent(
      JSON.stringify({
        sessionId,
        callbackUrl: "http://192.168.0.182:8000/data/" + sessionId,
      })
    );

  res.send({
    sessionId,
    templateUrl,
  });
});

app.post("/data/:sessionId", async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  let proofs = req.body.proofs;
  const type = req.query.type;

  try {
    if (type === "message") {
      const whistleBlowMessage = req.body.whistleBlowMessage;

      await Submissions.findOneAndUpdate(
        { sessionId },
        { message: whistleBlowMessage }
      );

      res.status(200).send({
        message: "submitted message",
      });
      return;
    }

    console.log("proofs", req.body);

    // const isProofsValid = await validateProofs(proofs);
    const isProofsValid = true;
    if (!isProofsValid) {
      res.status(400).send({
        message: "Invalid proof",
      });
      return;
    }

    await Submissions.findOneAndUpdate(
      { sessionId },
      { proof: JSON.stringify(proofs), proofHash: JSON.stringify(proofs) }
    );

    res.status(200).send({
      sessionId,
      proofs,
      message: "proofs submitted",
    });
  } catch {
    res.status(400).send({
      message: "Invalid proof",
    });
  }
});

app.get("/status/:sessionId", async (req, res: Response) => {
  const sessionId = req.params.sessionId;

  try {
    const submission = await Submissions.findOne({
      sessionId,
    });

    if (!submission) {
      res.status(400).send({
        message: "Invalid sessionId",
      });
      return;
    }

    if (!submission.proof || !submission.proofHash) {
      res.status(200).send({
        sessionId,
        status: SubmissionStatus.pending,
      });
      return;
    } else {
      res.status(200).send({
        sessionId,
        status: SubmissionStatus.completed,
      });
      return;
    }
  } catch (error) {
    res.status(400).send({
      message: "Invalid sessionId",
    });
  }
});

const start = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    app.listen(port, () => console.log("Server started on port", port));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
