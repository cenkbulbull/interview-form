"use client";
import { useEffect, useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

const FormAnswers = () => {
  const params = useParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return; // formId'yi almadan API çağırma

    const token = Cookies.get("token");

    if (!token) {
      setError("Token is required");
      return;
    }

    const fetchAnswers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getForm/${params.id}/answers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı Authorization başlığında gönderiyoruz
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch answers");
        }

        const data = await response.json();

        setAnswers(data.formWithAnswers); // Veriyi 'formWithAnswers' olarak almak gerekiyor.
      } catch (err) {
        setError("An error occurred while fetching the answers.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [params.id]);

  if (loading) return <p>Loading answers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white p-4 lg:p-8 rounded-2xl text-gray-800 w-full max-h-[50vh] overflow-auto">
      <Table>
        <TableCaption>Form answers are listed.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {answers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                No answers available
              </TableCell>
            </TableRow>
          ) : (
            answers.map((respondent, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {respondent.userEmail}
                </TableCell>
                <TableCell className="text-right">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button size="icon" variant="outline">
                        <MdOutlineRemoveRedEye />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="text-xs">
                      <DrawerHeader>
                        <DrawerTitle className="px-4 font-bold tracking-widest underline decoration-primary decoration-4 underline-offset-8">
                          Form Answers - {respondent.userEmail}
                        </DrawerTitle>
                      </DrawerHeader>

                      <div className="p-8 pt-4 max-h-[500px] overflow-auto">
                        <Accordion type="single" collapsible>
                          {respondent.answers.map((answer, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`}>
                              <AccordionTrigger>
                                {answer.question}
                              </AccordionTrigger>
                              <AccordionContent>
                                {answer.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormAnswers;
