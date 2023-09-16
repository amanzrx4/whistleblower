"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const RECLAIM_APP_URL = "https://share.reclaimprotocol.org";
const prisma = new client_1.PrismaClient();
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["pending"] = "pending";
    SubmissionStatus["completed"] = "completed";
})(SubmissionStatus || (SubmissionStatus = {}));
process.on("uncaughtException", function (err) {
    console.log("UNCAUGHT EXCEPTION:\t", err);
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/whistleblow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = yield prisma.submissions.findMany();
        const filteredQuery = query.filter((i) => i.message && i.proof && i.proofHash && i.sessionId);
        res.status(200).send({
            data: filteredQuery,
            message: "success",
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
}));
app.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = (0, uuid_1.v4)();
    yield prisma.submissions
        .create({
        data: {
            sessionId,
        },
    })
        .catch((e) => {
        res.status(500).send({
            message: "Something went wrong",
        });
        return;
    });
    const templateUrl = RECLAIM_APP_URL +
        "/" +
        "selectLinks" +
        "/" +
        encodeURIComponent(JSON.stringify({
            sessionId,
            callbackUrl: "http://192.168.68.104:8000/data/" + sessionId,
        }));
    res.send({
        sessionId,
        templateUrl,
    });
}));
app.post("/data/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req.params.sessionId;
    let proofs = req.body.proofs;
    const type = req.query.type;
    if (type === "message") {
        const whistleBlowMessage = req.body.whistleBlowMessage;
        console.log("whistleBlowMessage", whistleBlowMessage);
        const submission = yield prisma.submissions.findFirstOrThrow({
            where: {
                sessionId,
            },
        });
        yield prisma.submissions.update({
            where: {
                id: submission.id,
            },
            data: {
                message: whistleBlowMessage,
            },
        });
        res.status(200).send({
            message: "submitted message",
        });
        return;
    }
    console.log("proofs", req.body);
    try {
        // const isProofsValid = await validateProofs(proofs);
        const isProofsValid = true;
        console.log("proofs valid", isProofsValid);
        if (!isProofsValid) {
            res.status(400).send({
                message: "Invalid proof",
            });
            return;
        }
        try {
            const submission = yield prisma.submissions.findFirstOrThrow({
                where: {
                    sessionId,
                },
            });
            yield prisma.submissions.update({
                where: {
                    id: submission.id,
                },
                data: {
                    proof: JSON.stringify(proofs),
                    proofHash: JSON.stringify(proofs),
                },
            });
        }
        catch (error) {
            console.log("error", error);
            res.status(400).send({
                message: "Invalid sessionId",
            });
            return;
        }
        res.status(200).send({
            sessionId,
            proofs,
            message: "proofs submitted",
        });
    }
    catch (error) {
        res.status(400).send({
            message: "Invalid proof",
        });
    }
}));
app.get("/status/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req.params.sessionId;
    try {
        const submission = yield prisma.submissions.findFirstOrThrow({
            where: {
                sessionId,
            },
        });
        if (!submission.proof || !submission.proofHash) {
            res.status(200).send({
                sessionId,
                status: SubmissionStatus.pending,
            });
            return;
        }
        else {
            res.status(200).send({
                sessionId,
                status: SubmissionStatus.completed,
            });
            return;
        }
    }
    catch (error) {
        res.status(400).send({
            message: "Invalid sessionId",
        });
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://192.168.68.104:${port}`);
});
