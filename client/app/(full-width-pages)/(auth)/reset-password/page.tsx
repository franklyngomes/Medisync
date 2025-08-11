"use client"
import React from "react";
import Link from "next/link";
import Button from "../../../../components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../../../icons";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import OtpInput from 'react-otp-input';
import { RestPasswordQuery } from "../../../../api/query/AuthQuery";

interface ResetPaswordFormProps {
  email: string;
  newPassword: string;
  code: number
}
const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  newPassword: yup.string().required("Password is required").min(8).max(15),
})
export default function RestPassword() {
  const [code, setCode] = React.useState('');
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const {mutateAsync} = RestPasswordQuery()

  const onSubmit = async (data: ResetPaswordFormProps) => {
    const { email, newPassword} = data
    const formData = new FormData()
    formData.append('email', email)
    formData.append('newPassword', newPassword)
    formData.append('code', code)
    await mutateAsync(formData, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          reset()
          router.push("/signin")
        } else {
          toast.error(res?.response?.data?.message)
        }
      }
    })

  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Enter Email"
                        />
                      )}
                    />
                    {errors.email && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Controller
                      control={control}
                      name="newPassword"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Enter new password"
                          type={showPassword ? "text" : "password"}
                        />
                      )}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors.newPassword && (
                    <p style={{ color: "red", margin: "0", padding: "5px" }}>
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label>
                    OTP<span className="text-error-500">*</span>
                  </Label>
                  <div className="flex justify-center">
                    <OtpInput
                      value={code}
                      onChange={setCode}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
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
  );
}
