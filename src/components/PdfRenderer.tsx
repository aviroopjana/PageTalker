"use client";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { z } from "zod";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const { ref, width } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-xl shadow flex flex-col items-center">
      <div className="w-full h-14 border-zinc-300 flex items-center justify-between px-2">
        <div className="flex items-center gap1.5">
          <Button
            disabled={currentPage < 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
            variant={"ghost"}
            aria-label="Previous page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input {...register("page")} className="w-12 h-8" />
            <span>/</span>
            <span>{numPages ?? "x"}</span>
          </div>

          <Button
            disabled={numPages === undefined || currentPage === numPages}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
            }}
            variant={"ghost"}
            aria-label="Previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            className="max-h-full"
            file={url}
            loading={
              <div className="flex justify-center">
                <Loader className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast({
                title: "Failed to render PDF",
                description: "Please try again",
                variant: "destructive",
              });
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={currentPage} width={width ? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
