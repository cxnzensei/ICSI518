// import { logoutAccount } from '@/lib/actions/user.actions'
import { logoutUser, request } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
    const router = useRouter();

    const handleLogOut = async () => {

        request("POST", "/api/v1/auth/logout")
            .then(() => {
                logoutUser()
                router.push('/login')
            })
            .catch(error => {
                console.log(error)
            })
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
                <p className="text-14 truncate font-normal text-gray-600">
                    {user?.emailId}
                </p>
            </div>

            <div onClick={handleLogOut}>
                <Image width={25} height={25} src="icons/logout.svg" alt="jsm" />
            </div>
        </footer>
    )
}

export default Footer