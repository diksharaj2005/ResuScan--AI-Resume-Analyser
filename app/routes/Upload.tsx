import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { generateUUID } from "~/lib/formatSize";
import { convertPdfToImage } from "~/lib/pdftoimg";
import { usePuterStore } from "~/lib/puter";
import { prepareInstructions } from "contents";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setStatusText("Uploading the file...");
      console.log("Uploading file:", file.name);

      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) {
        setStatusText("Error: Failed to upload file");
        return;
      }

      setStatusText("Converting to image...");
      console.log("Converting PDF → Image...");
      const imageResult = await convertPdfToImage(file);

      if (!imageResult.file) {
        console.error("PDF conversion failed:", imageResult.error);
        setStatusText(`Error: ${imageResult.error ?? "Failed to convert PDF"}`);
        return;
      }

      setStatusText("Uploading the image...");
      const uploadedImage = await fs.upload([imageResult.file]);
      if (!uploadedImage) {
        setStatusText("Error: Failed to upload image");
        return;
      }

      setStatusText("Preparing data...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing...");
      console.log("Calling AI with resume:", uploadedFile.path);

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );

      if (!feedback) {
        setStatusText("Error: Failed to analyze resume");
        return;
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      try {
        data.feedback = JSON.parse(feedbackText);
      } catch (err) {
        console.error("Failed to parse feedback JSON:", feedbackText, err);
        setStatusText("Error: Invalid feedback format");
        return;
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting...");
      console.log("Final saved data:", data);
      navigate(`/resume/${uuid}`);
    } catch (err) {
      console.error("Unexpected error in handleAnalyze:", err);
      setStatusText(
        `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) {
      setStatusText("Error: Please upload a resume file first");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main>
      <Navbar />
      <section className="flex flex-col items-center gap-6 pt-12 mx-15 pb-5">
        <div className="flex flex-col items-center gap-6 max-w-4xl text-center py-10 md:py-3">
          <h1 className=" text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#eadc6e] via-[#ffffff] to-[#6a7ee5] leading-tight tracking-[-2px] font-bold">
            Smart feedback for your Dream Job
          </h1>
          {isProcessing ? (
            <>
              <h2 className="text-white text-2xl font-semibold font-sans">
                {statusText}
              </h2>
              <img
                src="/images/resume-scan.gif"
                alt="resume_scan"
                className="w-full"
              />
            </>
          ) : (
            <h2 className="md:text-2xl text-xl text-white">
              Drop your resume for an ATS score and Improvement tips{" "}
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 items-start md:gap-8 w-full mt-8"
            >
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="company-name" className="text-gray-100">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                  className="w-full p-4 inset-shadow rounded-2xl focus:outline-none bg-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="job-title" className="text-gray-100">
                  Job Title
                </label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                  className="w-full p-4 inset-shadow rounded-2xl focus:outline-none bg-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="job-description" className="text-gray-100">
                  Job Description
                </label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                  className="w-full p-4 inset-shadow rounded-2xl focus:outline-none bg-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="uploader" className="text-gray-100">
                  Upload Your Resume
                </label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button
                className="text-white rounded-full px-4 py-2 cursor-pointer w-full 
                  bg-gradient-to-b from-[#04b2ec] to-[#0011fc]
                  shadow-[0_0_15px_5px_#00fbff] hover:scale-105 transition-all text-xl font-extrabold"
                type="submit"
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
