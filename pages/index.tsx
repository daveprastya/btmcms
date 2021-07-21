import React from "react";
import { Layout } from "../src/components";
import Image from "next/image";
import { useBtmContext } from "../src/BtmContext";
import { useRouter } from "next/router";

type Input = {
  username: string;
  password: string;
};

export default function Login() {
  const [input, setInput] = React.useState<Input>({
    username: "",
    password: "",
  });

  const router = useRouter();
  const btmContext = useBtmContext();

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInput = {
      ...input,
      [name]: value,
    };
    setInput(newInput);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await btmContext.postLogin({
      username: input.username,
      password: input.password,
    });
    if (localStorage.getItem(`${process.env.NEXT_PUBLIC_LOCALSTORAGE}`))
     await router.push("/dashboard");
  };

  return (
    <Layout title="Login">
      <div className="min-h-screen flex items-center justify-center bg-wardah-primary bg-opacity-80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 shadow-2xl bg-wardah-primary rounded-md py-3">
          <div className="flex justify-center">
            <Image
              src={`${process.env.NEXT_PUBLIC_LOGO}`}
              alt="Logo"
              height={48}
              width={216.5}
            />
          </div>
          <form className="mt-8 px-3" method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  UserName
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={input.username}
                  onChange={inputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={input.password}
                  onChange={inputChange}
                />
              </div>
            </div>
            {btmContext.isError && (
              <p className="text-red-600 text-center font-semibold my-1">
                {btmContext.isError}
              </p>
            )}
            <div className={btmContext.isError ? "" : "mt-8"}>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
