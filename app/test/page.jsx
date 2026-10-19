'use client';
import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs';

const page = () => {
  const { user } = useUser();
  const handleTest = async () => { 
      console.log("user object: ", user)
   }
  return (
    <div>
      <button onClick={handleTest}>click me to text</button>
    </div>
  )
}

export default page