'use client';

import React, { useEffect, useState } from 'react'
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
import { usePathname, useRouter } from 'next/navigation';
import { getLoggedInUser, setLoggedInUser, request } from '@/lib/utils';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = ({ type }: { type: string }) => {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const loggedInUser = getLoggedInUser();
        setUser(loggedInUser);
        if (loggedInUser?.emailId && (pathname === '/login' || pathname === '/register')) {
            router.push('/')
        }
    }, [pathname, router])

    const formSchema = authformSchema(type);

    //define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        }
    })

    //submit handler
    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        setIsLoading(true);

        let modifiedValues;

        if (type === 'register') {
            modifiedValues = { ...data, emailId: data.email }
        }

        if (type === 'login') {
            modifiedValues = { emailId: data.email, password: data.password }
        }

        try {
            const response = await request("POST", `/api/v1/auth/${type}`, modifiedValues);
            setLoggedInUser(response?.data)
            toast.success(`Welcome${type === "login" ? "back" : ""}, ${response.data?.firstName}!`, { autoClose: 3000 })
            router.push('/')
        } catch (error: any) {
            toast.error(error.response.data, { autoClose: 3000 })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <div className="cursor-pointer flex items-center gap-1">
                    <Image
                        src="/icons/logo.svg"
                        width={72}
                        height={72}
                        alt="WealthWise logo"
                        priority
                    />
                    <h1 className="text-26 font-bold text-black-1">WealthWise</h1>
                </div>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text36 font-semibold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'login'
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
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name="firstName" label="First Name" placeholder='Enter Your First Name' />
                                    <CustomInput control={form.control} name="lastName" label="Last Name" placeholder='Enter Your Last Name' />
                                </div>
                            )}
                            <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
                            <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" />
                            <div className='flex flex-col gap-4'>
                                <Button type="submit" className='form-btn'>
                                    {isLoading ? (
                                        <div className='flex gap-1'>
                                            <Loader2 size={20} className='animate-spin' />
                                            <div>Loading...</div>
                                        </div>
                                    ) : type === 'login' ? 'Log In' : 'Sign Up'
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'login' ? 'Dont have an account?' : 'Already have an account?'}
                        </p>
                        <Link href={type === 'login' ? '/register' : '/login'} className='form-link'>
                            {type === 'login' ? 'Sign up' : 'Log in'}
                        </Link>
                    </footer>
                </>
            )}
            <ToastContainer />
        </section >
    )
}

export default AuthForm