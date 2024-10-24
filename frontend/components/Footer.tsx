import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { logoutUser, request } from '@/lib/utils'
import { FooterProps } from '@/types'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        request("POST", "/api/v1/auth/logout")
            .then(() => {
                logoutUser()
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => router.push("/login"))
    }

    return (
        <footer className="footer">
            <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                <p className="text-xl font-bold text-gray-700">
                    {user?.firstName[0]}
                </p>
            </div>

            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                <h1 className="text-14 truncate text-gray-700 font-semibold">
                    {user?.firstName}
                </h1>
                <p className="text-xs truncate font-normal text-gray-600">
                    {user?.emailId}
                </p>
            </div>

            <div onClick={handleLogout}>
                <Image width={25} height={25} src="icons/logout.svg" alt="logout" />
            </div>
        </footer>
    )
}

export default Footer