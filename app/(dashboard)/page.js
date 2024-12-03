"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaRegCopy } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FcQuestions } from "react-icons/fc";
import { FaMinus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { setForms, addForm } from "@/store/formsSlice";

const Home = () => {
  const [formName, setFormName] = useState("");
  const [questions, setQuestions] = useState([{ id: 1, value: "" }]); // Başlangıçta bir tane input
  const [email, setEmail] = useState(null);
  const { forms } = useSelector((state) => state.forms);
  const [loading, setLoading] = useState(false); // Yükleniyor durumu
  const [error, setError] = useState(null); // Hata durumu
  const [formQuestions, setFormQuestions] = useState([]); // Soruları her form için tut
  const [activeFormId, setActiveFormId] = useState(null); // Hangi formun soruları görüntüleniyor
  const { toast } = useToast();

  const dispatch = useDispatch();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    setEmail(savedEmail);

    const fetchForms = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("token");

        const response = await fetch("/api/getForms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Formlar alınırken bir hata oluştu.");
        }

        const data = await response.json();

        const updatedFormQuestions = await Promise.all(
          data.forms.map(async (form) => {
            const questions = await Promise.all(
              form.questions.map((questionId) => getQuestions(questionId))
            );
            return { formId: form._id, questions };
          })
        );

        dispatch(setForms(data.forms));

        setFormQuestions(updatedFormQuestions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();

    const getQuestions = async (questionId) => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("token");

        const response = await fetch(`/api/getQuestion/${questionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Questions alınırken bir hata oluştu.");
        }

        const data = await response.json();
        return { _id: data._id, questionText: data.questionText };
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  }, [dispatch]);

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { id: prevQuestions.length + 1, value: "" },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (id, event) => {
    const updatedQuestions = questions.map((question) =>
      question.id === id ? { ...question, value: event.target.value } : question
    );
    setQuestions(updatedQuestions);
  };

  const createForm = async () => {
    if (!formName || questions.some((q) => q.value.trim() === "")) {
      toast({
        title: "Error",
        description: "Form name and all questions are required.",
        variant: "destructive",
      });
      return;
    }

    const token = Cookies.get("token");

    try {
      const response = await fetch("/api/createForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          formName,
          questions: questions.map((q) => ({ questionText: q.value })),
        }),
      });

      const data = await response.json();

      dispatch(addForm(data.form));

      if (response.ok) {
        toast({
          title: "Form Created",
          description: "Your form has been created successfully!",
        });
        setFormName(""); // Form adını sıfırla
        setQuestions([{ id: 1, value: "" }]); // Soruları sıfırla
      } else {
        toast({
          title: "Error",
          description:
            data.message || "An error occurred while creating the form.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Form link copied",
          description: link,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to copy the link. Please try again.",
          variant: "destructive",
        });
        console.error("Clipboard copy failed", error);
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div className="text-2xl lg:text-4xl font-light leading-tight">
          <span className="font-bold tracking-widest underline decoration-primary decoration-4 underline-offset-8">
            {email}
          </span>
          Welcome
        </div>
        <div className="italic">
          Create a form, copy the link and send it to anyone you want.
        </div>
      </div>

      <div className="relative bg-white p-4 lg:p-8 rounded-2xl text-gray-800">
        <Dialog>
          <DialogTrigger asChild className="absolute right-[-20px] top-[-20px]">
            <Button>Create Form</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new form</DialogTitle>
            </DialogHeader>

            <form className="grid gap-4 max-h-[400px] overflow-auto pe-3">
              <div className="grid gap-2">
                <Label htmlFor="formName">Form Name</Label>
                <Input
                  id="formName"
                  type="text"
                  placeholder="Form Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="text-xs placeholder:text-xs focus-visible:ring-0"
                />
              </div>

              {questions.map((question, index) => (
                <div key={`${question.id}-${index}`} className="grid gap-2">
                  {" "}
                  {/* Use both id and index for uniqueness */}
                  <div className="flex gap-1 items-center justify-between">
                    <Label htmlFor={`question-${question.id}`}>
                      Question {question.id}
                    </Label>

                    <FaMinus
                      className="cursor-pointer"
                      onClick={() => removeQuestion(question.id)}
                    />
                  </div>
                  <Textarea
                    id={`question-${question.id}`}
                    type="text"
                    placeholder={`Question ${question.id}`}
                    required
                    value={question.value}
                    onChange={(e) => handleQuestionChange(question.id, e)}
                    className="text-xs placeholder:text-xs focus-visible:ring-0"
                  />
                </div>
              ))}
            </form>

            <DialogFooter className="flex flex-row justify-end gap-1">
              <Button size="icon" onClick={addQuestion}>
                <GoPlus />
              </Button>
              <Button type="submit" onClick={createForm}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="max-h-[200px] overflow-auto">
          <Table>
            <TableCaption>A list of forms you created.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow key={form._id}>
                    <TableCell className="font-medium">
                      <Link href={`/forms/${form._id}`}>{form.formName}</Link>
                    </TableCell>
                    <TableCell>{form.questions.length}</TableCell>
                    <TableCell className="flex float-right">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="mr-2"
                            onClick={() => setActiveFormId(form._id)} // Set the active form
                          >
                            <MdOutlineRemoveRedEye />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="text-xs">
                          <DrawerHeader>
                            <DrawerTitle className="px-4 font-bold tracking-widest underline decoration-primary decoration-4 underline-offset-8">
                              {form.formName}
                            </DrawerTitle>
                          </DrawerHeader>

                          <div className="p-8 pt-4">
                            {/* Display the questions dynamically based on active form */}
                            <ul className="flex flex-col gap-4 overflow-auto max-h-[50vh]">
                              {formQuestions
                                .find((f) => f.formId === activeFormId)
                                ?.questions.map((q, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-1 items-center"
                                  >
                                    <FcQuestions />
                                    {q.questionText}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </DrawerContent>
                      </Drawer>

                      <Button
                        size="icon"
                        onClick={() => {
                          const link = `${process.env.NEXT_PUBLIC_BASE_URL}/forms/${form._id}/form`;
                          copyToClipboard(link);
                        }}
                      >
                        <FaRegCopy />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Home;
