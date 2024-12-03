import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true, // Sorunun metni zorunludur
  },
  //options: [String], // Eğer çoktan seçmeli bir soru ise seçenekler
});

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export { Question };
