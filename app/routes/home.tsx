import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";

import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuScan" },
    { name: "description", content: "Smart feedback for your dream" },
  ];
}

export function links() {
  return [
    { rel: "icon", type: "image/png", href: "/icon.png" },
    { rel: "apple-touch-icon", href: "/icon.png" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResume = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      console.log(parsedResume);
      setResumes(parsedResume || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main>
      <Navbar />
      <section className="flex flex-col items-center gap-8 pt-12 mx-15 pb-5">
        <div className="flex flex-col items-center gap-8 max-w-4xl text-center py-8">
          <h1
            className="md:text-5xl text-3xl font-bold md:bg-gradient-to-r md:from-amber-600 md:via-white md:to-yellow-500 bg-clip-text text-transparent leading-tight tracking-[-2px] 
          bg-gradient-to-r from-orange-600 via-white to-amber-200"
          >
            Track Your Applications & Resume Ratings
          </h1>
          <h2 className=" md:text-lg text-xs text-gray-300">
            Smart feedback for your dream applications
          </h2>

          {!loadingResumes && resumes.length === 0 ? (
            <h2 className="md:text-lg text-xs text-gray-300">
              No resumes found.Upload your first resume to get feedback
            </h2>
          ) : (
            <h2 className="md:text-lg text-xs text-gray-300">
              Review your submissions and check AI-powered feedback.
            </h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-cols items-center justify-center">
            <img
              src="/images/resumes-scan-2.gif"
              alt=""
              className="w-[200px]"
            />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2
          md:grid-cols-3 gap-8"
          >
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="bg-blue-800 px-4 py-2 text-xl font-semibold rounded-full w-fit text-white cursor-pointer"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
