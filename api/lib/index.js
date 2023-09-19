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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const models_1 = __importDefault(require("./models"));
const utils_1 = require("./utils");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const RECLAIM_APP_URL = "https://share.reclaimprotocol.org";
const SERVER_URL = "https://whistleblower-backend-qq9t.onrender.com";
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["pending"] = "pending";
    SubmissionStatus["completed"] = "completed";
})(SubmissionStatus || (SubmissionStatus = {}));
process.on("uncaughtException", function (err) {
    console.log("UNCAUGHT EXCEPTION:\t", err);
});
app.get("/hello", (_, res) => {
    res.status(200).send("Hello World");
});
app.get("/whistleblow", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = yield models_1.default.find({}).sort("-createdAt");
        const filteredQuery = query.filter((i) => i.message && i.proof && i.sessionId);
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
    yield models_1.default.create({
        sessionId,
        proof: null,
    }).catch((e) => {
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
            callbackUrl: SERVER_URL + "/data/" + sessionId,
        }));
    res.send({
        sessionId,
        templateUrl,
    });
}));
app.post("/proofTest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const proofs = req.body.proofs;
    const isProofsValid = yield (0, utils_1.validateProofs)(proofs);
    res.status(200).send({
        isProofsValid,
    });
}));
app.post("/data/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req.params.sessionId;
    let proofs = req.body.proofs;
    const type = req.query.type;
    try {
        if (type === "message") {
            const whistleBlowMessage = req.body.whistleBlowMessage;
            yield models_1.default.findOneAndUpdate({
                sessionId,
            }, { message: whistleBlowMessage })
                .where("message")
                .equals(null)
                .where("proof")
                .equals(null);
            res.status(200).send({
                message: "submitted message",
            });
            return;
        }
        const isProofsValid = yield (0, utils_1.validateProofs)(proofs);
        if (!isProofsValid) {
            res.status(400).send({
                message: "Invalid proof",
            });
            return;
        }
        yield models_1.default.findOneAndUpdate({ sessionId }, { proof: JSON.stringify(proofs) })
            .where("message")
            .equals(null)
            .where("proof")
            .equals(null);
        res.status(200).send({
            sessionId,
            proofs,
            message: "proofs submitted",
        });
    }
    catch (_a) {
        res.status(400).send({
            message: "Invalid proof",
        });
    }
}));
app.get("/status/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = req.params.sessionId;
    try {
        const submission = yield models_1.default.findOne({
            sessionId,
        });
        if (!submission) {
            res.status(400).send({
                message: "Invalid sessionId",
            });
            return;
        }
        if (!submission.proof) {
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
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(DATABASE_URL);
        app.listen(port, () => console.log("Server started on port", port));
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
start();
