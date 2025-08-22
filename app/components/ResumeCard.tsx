import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeURL, setResumeURL] = useState("");
  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);

      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeURL(url);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="flex flex-col gap-8  h-[460px] w-full lg:w-[300px] xl:w-[340px] bg-transparent border border-white rounded-2xl p-4 animate-in fade-in duration-1000"
    >
      <div className="flex flex-row gap-2 justify-between min-h-[90px] max-sm:flex-col items-center max-md:justify-center max-md:items-center">
        <div className="flex flex-col gap-1">
          {companyName && (
            <h2 className="!text-white font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-300">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="text-white font-bold">Resume</h2>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {resumeURL && (
        <div className=" bg-gradient-to-b from-light-blue-100 to-light-blue-200 p-4 rounded-2xl animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeURL}
              alt="resume"
              className="w-full h-[250px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;
