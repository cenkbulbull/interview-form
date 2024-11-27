"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaRegCopy } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useState } from "react";

const Home = () => {
  const [questions, setQuestions] = useState([{ id: 1, value: "" }]); // Başlangıçta bir tane input

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { id: prevQuestions.length + 1, value: "" },
    ]);
  };

  const handleQuestionChange = (id, event) => {
    const updatedQuestions = questions.map((question) =>
      question.id === id ? { ...question, value: event.target.value } : question
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div className="text-2xl lg:text-5xl font-light leading-tight">
          <span className="font-bold tracking-widest"> Cenk Bülbül </span>
          Welcome
        </div>
        <div className="italic">
          Create a form, copy the link and send it to anyone you want.
        </div>
      </div>

      <div className="relative bg-white lg:p-8 rounded-2xl text-gray-800">
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
                  required
                  className="text-xs placeholder:text-xs focus-visible:ring-0"
                />
              </div>

              {questions.map((question) => (
                <div key={question.id} className="grid gap-2">
                  <Label htmlFor={`question-${question.id}`}>
                    Question {question.id}
                  </Label>
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

            <DialogFooter>
              <Button size="icon" onClick={addQuestion}>
                <GoPlus />
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            <TableRow>
              <TableCell className="font-medium">
                Frontend Intern Form
              </TableCell>
              <TableCell>8</TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="outline" className="mr-2">
                  <MdOutlineRemoveRedEye />
                </Button>
                <Button size="icon">
                  <FaRegCopy />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
