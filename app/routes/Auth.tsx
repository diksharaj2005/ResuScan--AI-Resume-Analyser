import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "ResuScan | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="min-h-screen flex items-center justify-center ">
      <div className="bg-gradient-to-b to-gray-500 p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-8 bg-transparent border border-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-extrabold text-5xl bg-gradient-to-r from-white via-yellow-300 to-orange-500 bg-clip-text text-transparent">
              Welcome
            </h1>
            <h2 className="font-bold text-3xl bg-gradient-to-r from-gray-100 via-yellow-500 to-white bg-clip-text text-transparent">
              Log In To Continue Your Job Journey
            </h2>
          </div>
          {isLoading ? (
            <button className="bg-gradient-to-l from-white via-orange-500 to-white rounded-full py-4 px-8 cursor-pointer w-[600px] max-md:w-full text-3xl font-semibold text-black animate-pulse">
              <p>Signing You in...</p>
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button
                  className="bg-gradient-to-l from-white via-orange-500 to-white rounded-full py-4 px-8 cursor-pointer w-[600px] max-md:w-full text-3xl font-semibold text-black animate-pulse"
                  onClick={auth.signOut}
                >
                  <p>Log Out</p>
                </button>
              ) : (
                <button
                  className="bg-gradient-to-l from-white via-orange-500 to-white rounded-full py-4 px-8 cursor-pointer w-[600px] max-md:w-full text-3xl font-semibold text-black animate-pulse"
                  onClick={auth.signIn}
                >
                  <p>Log In</p>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Auth;
