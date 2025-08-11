"use client"
import Link from "next/link";
import Button from "../../../../components/ui/button/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ForgotPasswordQuery } from "../../../../api/query/AuthQuery";
import { useRouter } from "next/navigation";

interface ForgotPasswordFormProps {
  email: string;
}
const schema = yup.object({
  email: yup.string().email().required("Email is required"),
})
export default function ForgotPassword() {
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutateAsync } = ForgotPasswordQuery()
  const router = useRouter()
  const onSubmit = async (data : ForgotPasswordFormProps) => {
    const { email } = data
    const formData = new FormData()
    formData.append('email', email)
    await mutateAsync(formData, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          reset()
          router.push('/reset-password')
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
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and we&apos;ll give you a reset instruction !
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
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
