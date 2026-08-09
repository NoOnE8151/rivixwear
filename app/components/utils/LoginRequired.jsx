import React from 'react'
import Link from 'next/link'
import { X } from "lucide-react"

const LoginRequired = ({ setShowLoginRequired }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center">
  <div className="bg-background text-foreground max-w-md rounded-xl p-6 text-center shadow-xl flex flex-col gap-3 relative">
    <h2 className="text-2xl font-semibold mb-3">
      Login Required
    </h2>

    <p className="text-sm text-muted-foreground leading-relaxed">
      Please sign in or create an account to continue with your purchase.
      This helps us securely process your order and provide the best shopping experience.
    </p>

    <div className='flex justify-between px-10 mt-3'>
    <Link href={'/sign-up'} className='bg-element text-foreground-inverse px-5 py-2 rounded-lg font-semibold'>Sign UP</Link>
    <Link href={'/sign-in'} className='bg-element text-foreground-inverse px-5 py-2 rounded-lg font-semibold'>Login</Link>
    </div>
    <button className='absolute top-3 right-3 cursor-pointer'
    onClick={() => setShowLoginRequired(false)}><X /></button>
  </div>

</div>
  )
}

export default LoginRequired