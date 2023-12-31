"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";

import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "./ui/progress";
import { getS3Url, uploadToS3 } from "@/app/api/aws-s3/s3";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

const UploadDropzone = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(true);

  const [uploadedProgress, setUploadedProgress] = useState<number>(0);

  const { toast } = useToast();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
      console.log(file.id);
    },
    retry: true,
    retryDelay: 500,
  });

  const { mutate: insertFile } = trpc.insertFile.useMutation();

  const startSimulatedProgress = () => {
    setUploadedProgress(0);

    const interval = setInterval(() => {
      setUploadedProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        //handle FileUploading
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });

        const file = acceptedFile[0];

        try {
          const data = await uploadToS3(file);
          console.log("Upload Successful", data);
          const fileUrl = await getS3Url(data.file_key);
          // console.log("S3 URL:", url);

          const key = data.file_key;
          const fileName = data.file_name;

          insertFile({
            key: key,
            fileName: fileName,
            url: fileUrl,
          });

          if (!data || !key) {
            return toast({
              title: "Something went wrong",
              description: "Please try again later",
              variant: "destructive",
            });
          }

          startPolling({ key });
        } catch (error) {
          console.log(error);
        }

        clearInterval(progressInterval);
        setUploadedProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 border-dashed m-4 border-gray-300 rounded-xl"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-zinc-900 text-sm">
                  <span className="font-semibold ">Click to Upload</span> or
                  drag and drop files here.
                </p>
                <p className="text-xs text-zinc-400">PDF (Upto 4 MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-5xl flex items-center rounded-md bg-white overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mt-4 w-full max-w-xs mx-auto">
                  <Progress
                    value={uploadedProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
