"use client";

import React from 'react'
import UploadButton from './UploadButton';
import { SignedOut, UserButton } from '@clerk/nextjs';

const Dashboard = () => {
  return (
    <main className='mx-auto max-w-7xl md:p-10 '>
        <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
            <h1 className='font-bold text-4xl text-gray-900 mb-3'>
                My Files
            </h1>
            <UploadButton/>
            <UserButton afterSignOutUrl='/'/>
        </div>
    </main>
  )
}

export default Dashboard