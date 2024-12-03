// Form modelinin şeması
import mongoose from "mongoose";
import { Question } from "./Question"; // Soruları içeren model
import { Answer } from "./Answer"; // Yanıtları içeren model

const { Schema } = mongoose;

const formSchema = new Schema(
  {
    formName: {
      type: String,
      required: true, // Formun adı zorunludur
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question", // Sorulara referans (ObjectId)
      },
    ], // Sorular bir dizi (array) olarak tutulur
    respondents: [
      {
        userEmail: {
          type: String,
          required: true, // Cevaplayan kullanıcının e-posta adresi zorunludur
        },
        answers: [
          {
            type: Schema.Types.ObjectId,
            ref: "Answer", // Yanıtlar bir dizi olarak tutulur ve her bir yanıt, bir "Answer" modeline referans eder
          },
        ],
      },
    ], // Yanıtlayan kullanıcılar
  },
  { timestamps: true } // Otomatik olarak `createdAt` ve `updatedAt` alanları ekler
);

const Form = mongoose.models.Form || mongoose.model("Form", formSchema);

export { Form };
