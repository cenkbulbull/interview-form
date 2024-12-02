import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  // options: [String], // Eğer çoktan seçmeli bir soru ise seçenekler
});

const answerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

// Form Schema
const formSchema = new Schema(
  {
    formName: {
      type: String,
      required: true,
    },
    questions: [questionSchema], // Sorular
    respondents: [
      {
        userEmail: {
          type: String,
          required: true,
        },
        answers: [answerSchema], // Kullanıcının verdiği yanıtlar
      },
    ],
  },
  { timestamps: true }
);

// Modeli daha önce tanımlandıysa kullan, yoksa tanımla
const Form = mongoose.models.Form || mongoose.model("Form", formSchema);

export default Form;
