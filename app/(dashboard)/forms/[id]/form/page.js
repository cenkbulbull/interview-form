"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const Form = () => {
  // Soruların dizisi
  const questions = [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry?",
    "What is the capital of France?",
    "Who developed the theory of relativity?",
  ];

  const { toast } = useToast();
  const params = useParams(); // URL'deki id'yi alıyoruz
  const [email, setEmail] = useState(""); // E-posta inputu
  const [question, setQuestion] = useState(""); // Aktif soru
  const [answer, setAnswer] = useState(""); // Verilen cevap
  const [questionIndex, setQuestionIndex] = useState(0); // Soru index'i
  const [isEmailEntered, setIsEmailEntered] = useState(false); // E-posta girilip girilmediğini kontrol ediyoruz
  const [answers, setAnswers] = useState([]); // Cevapları saklayacağımız dizi

  // Sorulara göre question state'ini güncelleyen useEffect
  useEffect(() => {
    if (questionIndex < questions.length) {
      setQuestion(questions[questionIndex]);
    }
  }, [questionIndex]); // Sadece questionIndex değiştiğinde tetiklenir

  // "Next" butonuna tıklanıldığında çalışacak fonksiyon
  const handleNext = () => {
    if (isEmailEntered) {
      // Eğer son sorudaysak, Save Answers yapar
      if (questionIndex === questions.length - 1) {
        // Save answers kısmında tüm cevapları kaydediyoruz
        const finalAnswers = [...answers, answer]; // Son cevabı da ekliyoruz
        console.log("Answers Saved!");
        console.log({
          id: params.id, // ID bilgisi
          email: email, // E-posta bilgisi
          answers: finalAnswers, // Tüm cevaplar
        });
      } else {
        // Yeni soruya geçiyoruz ve inputu sıfırlıyoruz
        setAnswers((prevAnswers) => [...prevAnswers, answer]); // Cevabı ekliyoruz
        setAnswer(""); // Inputu sıfırlıyoruz
        setQuestionIndex((prevIndex) => prevIndex + 1); // Sonraki soruya geç
      }
    } else {
      // İlk adımda e-posta girildiğinde
      if (email) {
        setIsEmailEntered(true); // E-posta girildiğinde sorulara geçiyoruz
        setQuestionIndex(0); // İlk soruya başlıyoruz
      } else {
        toast({
          title: "Error",
          description: "Please enter your email to continue.",
          variant: "destructive", // Toast'un tipi: hata (destructive)
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        {!isEmailEntered ? (
          // E-posta girilmemişse, kullanıcıdan e-posta alıyoruz
          <div className="text-lg font-light leading-tight">
            <span className="tracking-widest underline decoration-primary decoration-2 underline-offset-4 transition-all duration-500">
              Enter your email to begin
            </span>
          </div>
        ) : (
          // Sorulara geçildiğinde, soru metni burada gösterilecek
          <div className="text-lg font-light leading-tight">
            <span
              className="tracking-widest underline decoration-primary decoration-2 underline-offset-4 transition-all duration-500"
              key={questionIndex}
            >
              {question}
            </span>
          </div>
        )}
        <div className="italic">
          {isEmailEntered
            ? "Enter your answer in the input on the side."
            : "Please enter your email to continue."}
        </div>
      </div>

      <div>
        {/* Bu divi sorular ve cevaplar için kullanıyoruz */}
        {isEmailEntered ? (
          <Textarea
            id="1"
            type="text"
            placeholder="Enter your answer."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="text-xs placeholder:text-xs focus-visible:ring-0  relative bg-white p-4 rounded-2xl text-gray-800 resize-none"
          />
        ) : (
          <Input
            id="email"
            type="email"
            placeholder="Enter your email."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-xs placeholder:text-xs focus-visible:ring-0  relative bg-white  p-4 rounded-2xl text-gray-800"
          />
        )}

        <div className="float-right my-4">
          <Button onClick={handleNext}>
            {isEmailEntered
              ? questionIndex === questions.length - 1
                ? "Save Answers"
                : "Next"
              : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Form;
