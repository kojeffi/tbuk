'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    
    // Simulate API call
    setTimeout(() => {
      setMessage('If an account with that email exists, we have sent a password reset link.')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div style={{minHeight: '100vh', padding: '20px', backgroundColor: '#008080', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '100%', maxWidth: '450px'}}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#008080', marginBottom: '5px'}}>Reset Your Password</h1>
          <p style={{color: '#666'}}>Enter your email to receive a reset link</p>
        </div>

        {message && (
          <div style={{padding: '15px', backgroundColor: '#e6f7ee', border: '1px solid #50C490', borderRadius: '10px', marginBottom: '20px', color: '#2e7d52'}}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#000', fontWeight: '500'}}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc'}}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button 
            type="submit"
            style={{width: '100%', backgroundColor: '#50C490', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px'}}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>

          <div style={{textAlign: 'center'}}>
            <Link href="/login" style={{color: '#008080', fontWeight: 'bold', textDecoration: 'underline'}}>
              Back to Login
            </Link>
          </div>
        </form>

        <div style={{marginTop: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px'}}>
          <p style={{fontSize: '14px', color: '#666', textAlign: 'center'}}>
            If you don't receive an email within a few minutes, please check your spam folder or contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}