"use client";
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

const UploadButton = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v)=> {
        if(!v) {
          setIsOpen(v)
        }
    }}>
      <DialogTrigger onClick={()=> setIsOpen(true)} asChild>
        <Button>
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        Example Trigger
      </DialogContent>
    </Dialog>
  )
}

export default UploadButton;