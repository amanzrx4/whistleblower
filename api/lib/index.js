"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
process.on("uncaughtException", function (err) {
    console.log("Uncaught exception: ", err);
});
app.get("/", (_, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log("process", process.env.CALLBACK_URL);
    console.log(`Server is running at http://localhost:${port}`);
});
