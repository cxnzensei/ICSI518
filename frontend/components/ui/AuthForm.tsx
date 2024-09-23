'use client';
import React, { use, useState } from 'react'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    username: z.string().min(2, {message: "Username must be at least 2 characters."}).max(50),
})

const AuthForm = ({type}:{type: string}) => {
    const [user, setUser] = useState(null)

    //define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
        }
    })

    //submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

  return (
    <section className='auth-form'>
        <div className='flex flex-col gap-1 md:gap-3'>   
            <h1>    
                {user
                    ? 'Link Account'
                    : type === 'log-in'
                        ? 'Log In'
                        : 'Sign Up'
                }
                <p>
                    {user
                        ? 'Link your account to get started'
                        : 'Please enter your details'
                    }
                </p>
            </h1>
            {user ? (
                <div className='flex flex-col gap-4'>
                    {/*plaidLink*/}
                </div>
            ) : (
                <>
                    FORM
                </>
            )
        }
        </div>
    </section>
  )
}

export default AuthForm