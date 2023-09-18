import mongoose, { Document, Schema } from "mongoose";

export interface SubmissionDocument extends Document {
  sessionId: string;
  proofHash?: string;
  proof?: string;
  message?: string;
}

const submissionsSchema = new Schema<SubmissionDocument>(
  {
    sessionId: { type: String, unique: true, required: true },
    proofHash: String,
    proof: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

const Submissions = mongoose.model<SubmissionDocument>(
  "Submissions",
  submissionsSchema
);

export default Submissions;
