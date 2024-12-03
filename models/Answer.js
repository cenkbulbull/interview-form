import mongoose from "mongoose";
import { Question } from "./Question"; // Bu, "Question" modelini içeri aktarır

const { Schema } = mongoose;

const answerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question", // "Question" modeline referans
    required: true, // Bu alan zorunlu
  },
  answer: {
    type: String,
    required: true, // Yanıt zorunludur
  },
});

const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);

export { Answer };
