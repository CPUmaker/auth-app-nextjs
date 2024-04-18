"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "./card-wrapper";
import { verifyEmail } from "@/actions/verification";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      setIsLoading(false);
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your email"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        {isLoading ? <BeatLoader /> : null}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
