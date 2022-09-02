import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/parts/DashboardHeader";
import Main from "@/components/layouts/Main";
import ContentWrapper from "@/components/parts/ContentWrapper";
import Spinner from "@/components/core/Spinner";
import { NextSeo } from "next-seo";
import Button from "@/components/core/Button";
import { useForm } from "react-hook-form";
import { setCookie } from "nookies";
import { useAppContext } from "@/context/AppWrapper";
import SimpleFormGenerator from "@/components/core/SimpleFormGenerator";
import axios from "axios";
import { Sleeper } from "@/lib/Helpers";
import { Schema__Form__Login } from "@/lib/Schema";

const Login = () => {
  const { user } = useAppContext();
  if (user.isLoggedIn) {
    location.replace("/clients");
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: `all`,
  });
  const [loginUser, setLoginUser] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = (data) => {
    setLoginUser((prevState) => ({ ...prevState, isLoading: true }));
    const payload = {
      identifier: data.email,
      password: data.password,
    };
    const postPayload = async () => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/local`, payload)
        .then(Sleeper(500))
        .then((res) => {
          console.log(res);
          const jwt = res.data.jwt;
          const id = res.data.user.id;
          setLoginUser((prevState) => ({
            ...prevState,
            response: res.data.data,
            isLoading: false,
          }));
          setCookie({ res }, "token", jwt, {
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
          setCookie({ res }, "id", id, {
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
          location.replace("/clients");
          reset();
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            const message = err.response?.data?.error?.message;
            setErrorMessage(message.charAt(0).toUpperCase() + message.slice(1));
          } else {
            setErrorMessage("Too many requests");
          }
          setLoginUser((prevState) => ({ ...prevState, isError: true, isLoading: false }));
        });
    };
    postPayload();
  };

  return (
    <>
      {!user.isLoggedIn && !user.isLoading && (
        <>
          <NextSeo title={`Login | Design Lab | OneIMS`} description={``} />
          <DashboardHeader logoCentered />
          <Main>
            <section>
              <ContentWrapper>
                <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-md w-full space-y-8">
                    <div>
                      <h1 className="mt-6 text-2xl font-medium text-center">
                        Sign in to your account
                      </h1>
                    </div>
                    <SimpleFormGenerator
                      onSubmit={handleSubmit(onSubmit)}
                      register={register}
                      schema={Schema__Form__Login}
                      errors={errors}
                      isDirty={isDirty}
                      isValid={isValid}
                      isLoading={loginUser.isLoading}
                      errorMessage={errorMessage}
                    />
                  </div>
                </div>
              </ContentWrapper>
            </section>
          </Main>
        </>
      )}
    </>
  );
};

export default Login;
