'use client';
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import Link from 'next/link';
import Image from "next/image"
import CustomInput from './CustomInput';
import { authformSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const AuthForm = ({ type }: { type: string }) => {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    //define form
    const form = useForm<z.infer<typeof authformSchema>>({
        resolver: zodResolver(authformSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    //submit handler
    function onSubmit(values: z.infer<typeof authformSchema>) {
        setIsLoading(true)
        console.log(values)
        setIsLoading(false);
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link className="cursor-pointer flex items-center gap-1" href="/">
                    <Image
                        src="/icons/logo.svg"
                        width={72}
                        height={72}
                        alt="WealthWise logo"
                    />
                    <h1 className="text-26 font-bold text-black-1">WealthWise</h1>
                </Link>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text36 font-semibold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'log-in'
                                ? 'Log In'
                                : 'Sign Up'
                        }
                        <p className='text-16 font-normal text-gray-600'>
                            {user
                                ? 'Link your account to get started'
                                : 'Please enter your details'
                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    {/*plaidLink*/}
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'register' && (
                                <>
                                    <CustomInput control={form.control} name='firstName'
                                    lable='First Name' placeholder='Enter Your First Name'/>
                                    <CustomInput control={form.control} name='lastName'
                                    lable='Last Name' placeholder='Enter Your Last Name'/>
                                    <CustomInput control={form.control} name='address'
                                    lable='Address' placeholder='Enter Your Street Address'/>
                                    <CustomInput control={form.control} name='state'
                                    lable='State' placeholder='ex. TX'/>
                                    <CustomInput control={form.control} name='postalCode'
                                    lable='ZIP Code' placeholder='ex. 20500'/>
                                    <CustomInput control={form.control} name='dateOfBirth'
                                    lable='Date of Birth' placeholder='YYYY-MM-DD'/>
                                    <CustomInput control={form.control} name='ssn'
                                    lable='SSN' placeholder='XXXX'/>
                                </>
                            )}
                            <CustomInput control={form.control} name="email" lable="Email" placeholder="Enter your email" />
                            <CustomInput control={form.control} name="password" lable="Password" placeholder="Enter your password" />
                            <div className='flex flex-col gap-4'>
                                <Button type="submit" disabled={isLoading} className='form-btn'>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' /> &nbsp:
                                            Loading...
                                        </>
                                    ) : type === 'log-in' ? 'Log In' : 'Sign Up'
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'log-in' ? 'Dont have an account?' : 'Already have an account?'}
                        </p>
                        <Link href={type === 'log-in' ? '/register' : '/login'} className='form-link'>
                            {type === 'log-in' ? 'Sign up' : 'Log in'}
                        </Link>
                    </footer>
                </>
            )
            }
        </section>
    )
}

export default AuthForm