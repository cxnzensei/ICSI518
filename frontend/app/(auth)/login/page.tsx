import AuthForm from '@/components/ui/AuthForm'
import React from 'react'

const Login = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="log-in" />
    </section>
    
  )
}

export default Login