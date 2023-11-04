"use client";
import { Loader } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector} from "react-resize-detector";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {

  const {toast} = useToast();

  const {ref,width} = useResizeDetector()

  return (
    <div className="w-full bg-white rounded-xl shadow flex flex-col items-center">
      <div className="w-full h-14 border-zinc-300 flex items-center justify-between px-2">
        <div className="flex items-center gap1.5">Top Bar</div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document file={url} loading={
            <div className="flex justify-center">
              <Loader className="my-24 h-6 w-6 animate-spin"/>
            </div>
          }
          onLoadError={()=> {
            toast({
              title: "Failed to render PDF",
              description: "Please try again",
              variant: "destructive"
            })
          }}
          >
            <Page pageNumber={1} width={width? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
