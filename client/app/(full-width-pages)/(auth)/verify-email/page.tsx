"use client"
import React from 'react'
import Link from "next/link";
import {VerifyEmailQuery} from "../../../../api/query/AuthQuery"
import Image from 'next/image';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = React.useState("");
  const [logo, setLogo] = React.useState("")
  const {mutateAsync} = VerifyEmailQuery()
  React.useEffect(() => {
    const urlParms = new URLSearchParams(window.location.search)
    const token = urlParms.get("token") ?? ""
    mutateAsync(token, {
      onSuccess: (res) => {
        if(res?.status === 200){
          setVerificationStatus(res?.data?.message)
          setLogo("./images/logo/success.svg")
        }else{
          setVerificationStatus(res?.response?.data?.message)
          setLogo("./images/logo/warning.svg")
        }
      }
    })
  },[mutateAsync])
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <Image src={logo ? logo : "./images/logo/error.svg"} width={60} height={60} alt='Success'/>
            <h2 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {verificationStatus}
            </h2>
          </div>
          <div>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Log in to your account -
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail