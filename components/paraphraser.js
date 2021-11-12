import React, { useCallback, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import copy from "copy-to-clipboard";

import HideShow from "../components/HideShow";

export default function Paraphraser(props) {
  const [paraphraseMode, setParaphraseMode] = useState("standard");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [paraphraseLoading, setParaphraseLoading] = useState(false);
  const [accessAvailable, setAccessAvailable] = useState(true);
  const inputTextRef = useRef(null);

  const handleInputTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleParaphraseSubmission = () => {
    (async () => {
      setParaphraseLoading(true);
      const loadingToast = toast.loading("Paraphrasing...");

      const rawResponse = await fetch(
        `https://rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com/rewrite`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-rapidapi-key": "4a040adf87msh3d8505baea27733p19374cjsn756e76744e03",
            "x-rapidapi-host": "rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com",
          },
          body: JSON.stringify({ text: inputText, "language": "en", "strength": 3 }),
        }
      ).catch((_err) => {
        toast.error(
          "We ran into an issue when trying to paraphrase. Please try again later."
        );
      });
      if (rawResponse && rawResponse.ok) {
        const content = await rawResponse.json();
        setOutputText(content.data.rewrite);
        toast.success("Successfully paraphrased. Enjoy!");
      } else {
        toast.error(
          "We ran into an issue when trying to paraphrase. Please try again later."
        );
      }
      toast.dismiss(loadingToast);
      setParaphraseLoading(false);
    })();
  };

  const handleCopyResult = () => {
    copy(outputText);
    toast.success("Copied result in your clipboard. Enjoy!");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    toast.success("Successfully cleared content.");
  };

  // useEffect(() => {
  //   let bypassCheck =
  //     location.search &&
  //     location.search.length > 0 &&
  //     location.search.includes("bypass=true");
  //   if (bypassCheck) {
  //     inputTextRef && inputTextRef.current.focus();
  //   } else {
  //     (async () => {
  //       const rawResponse = await fetch(
  //         `https://rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com/rewrite`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       ).catch((_err) => {});
  //       if (rawResponse && rawResponse.ok) {
  //         const content = await rawResponse.json();
  //         if (content && content.rewrite === "rewrite") {
  //           setAccessAvailable(true);
  //         }
  //       }
  //     })();
  //   }
  // }, []);

  return (
    <>
      {accessAvailable ? (
        <>
          <Toaster
            toastOptions={{
              className: "bg-gray-50 shadow-sm font-medium",
            }}
          />
          <header className="bg-white"> 
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-5xl font-bold leading-tight text-center text-gray-900">
                Paraphrasing Website
              </h1>
            </div>
          </header>
          <main>
            <section className="py-4 mx-auto border border-gray-100 rounded-lg shadow-sm max-w-7xl sm:px-6 lg:px-4">
              <div className="flex items-center justify-center">
                {/* <button
                  className={`inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none text-gray-500 hover:text-blue-600 focus:text-blue-600 ${
                    paraphraseMode === "standard"
                      ? "bg-blue-50 text-blue-700"
                      : ""
                  }`}
                  onClick={() => setParaphraseMode("standard")}
                >
                  Level 1
                </button>
                <button
                  className={`inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none text-gray-500 hover:text-green-600 focus:text-green-600 ${
                    paraphraseMode === "fluency"
                      ? "bg-green-50 text-green-700"
                      : ""
                  }`}
                  onClick={() => setParaphraseMode("fluency")}
                >
                  Level 2
                </button>
                <button
                  className={`inline-block rounded-lg font-medium leading-none py-2 px-3 focus:outline-none text-gray-500 hover:text-amber-600 focus:text-amber-600 ${
                    paraphraseMode === "creative"
                      ? "bg-amber-50 text-amber-700"
                      : ""
                  }`}
                  onClick={() => setParaphraseMode("creative")}
                >
                  Level 3
                </button> */}
              </div>
              <HideShow show={paraphraseMode === "standard"}>
                <div className="p-2 mt-2 font-semibold text-center text-blue-700 rounded-lg bg-blue-50">
                  Most conservative mode while rephrasing. The rephrased
                  sentences will be very close to the original.
                </div>
              </HideShow>
              <HideShow show={paraphraseMode === "fluency"}>
                <div className="p-2 mt-2 font-semibold text-center text-green-700 rounded-lg bg-green-50">
                  Happy middle ground between 'Standard' and 'Creative'. Tries
                  to change the sentence while trying to keep the meaning
                  intact.
                </div>
              </HideShow>
              <HideShow show={paraphraseMode === "creative"}>
                <div className="p-2 mt-2 font-semibold text-center rounded-lg bg-amber-50 text-amber-700">
                  Tries to change the sentence most but quite likely to have
                  errors.
                </div>
              </HideShow>
              <div className="p-4 sm:px-0">
                <div className="grid grid-cols-2 gap-x-1">
                  <label htmlFor="inputText">
                    <span className="block pb-2 text-center text-gray-600 md:hidden">
                      Text to paraphrase
                    </span>
                    <span className="hidden pb-2 text-center text-gray-600 md:block">
                      Enter the text you want to paraphrase
                    </span>
                    <textarea
                      name="inputText"
                      className="block w-full p-4 border-2 border-gray-200 rounded-lg resize-none h-96 disabled:opacity-60 sm:text-sm md:text-lg focus:outline-none focus:ring focus:border-blue-600"
                      placeholder="Enter the text you want to paraphrase. You can select any of the modes above for different levels of paraphrasing. After writing or pasting your text, use the Paraphrase button below."
                      value={inputText}
                      onChange={handleInputTextChange}
                      disabled={paraphraseLoading}
                      ref={inputTextRef}
                    ></textarea>
                  </label>
                  <label htmlFor="outputText">
                    <span className="block pb-2 text-center text-gray-600">
                      Paraphrased text
                    </span>
                    <textarea
                      name="outputText"
                      className="block w-full p-4 border-2 border-gray-200 rounded-lg resize-none h-96 disabled:opacity-60 sm:text-sm md:text-lg focus:outline-none focus:ring focus:border-blue-600"
                      placeholder="You will get the resulting text here after the paraphrasing tool has finished rephrasing."
                      value={outputText}
                      disabled={paraphraseLoading}
                      readOnly
                    ></textarea>
                  </label>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute left-0">
                  <span
                    className={`font-medium ${
                      [...inputText].length > 1000
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {[...inputText].length}
                  </span>
                  <span className="text-gray-500">/1000 Characters</span>
                  <span
                    className={` block font-medium ${
                      [...inputText].length > 500 ? "text-blue-500" : "hidden"
                    }`}
                  >
                    <a>
                      Contact us to get more than 1000 characters.
                    </a>
                  </span>
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center max-w-md py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md disabled:opacity-60 px-7 hover:bg-blue-700 md:py-3 md:text-lg md:px-10"
                  onClick={handleParaphraseSubmission}
                  disabled={
                    [...inputText].length <= 10 ||
                    [...inputText].length > 500 ||
                    paraphraseLoading
                  }
                >
                  {paraphraseLoading ? (
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx={12}
                        cy={12}
                        r={10}
                        stroke="currentColor"
                        strokeWidth={4}
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 mr-2 -ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  )}
                  {paraphraseLoading ? "Paraphrasing..." : "Paraphrase"}
                </button>
                <div className="absolute right-0 flex justify-center align-middle">
                  <HideShow
                    show={
                      [...inputText].length > 10 && [...inputText].length < 500
                    }
                  >
                    <button
                      type="button"
                      className="flex items-center justify-center max-w-md px-4 py-2 mx-2 font-medium text-red-500 border border-transparent rounded-md hover:text-red-600 focus:text-red-600 bg-red-50"
                      onClick={handleClear}
                    >
                      <svg
                        className="w-6 h-6 mr-2 -ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Clear all</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear all
                    </button>
                  </HideShow>
                  <HideShow show={[...outputText].length > 0}>
                    <button
                      type="button"
                      className="flex items-center justify-center max-w-md px-4 py-2 font-medium text-gray-500 border border-transparent rounded-md hover:text-blue-600 focus:text-blue-600 bg-gray-50"
                      onClick={handleCopyResult}
                    >
                      <svg
                        className="w-6 h-6 mr-2 -ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <title>Copy result</title>
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                      </svg>
                      Copy result
                    </button>
                  </HideShow>
                </div>
              </div>
            </section>
          </main>
        </>
      ) : (
        <h1 className="p-20 text-2xl text-center">
          The service is unavailable in Australia under the "Tertiary Education
          Quality and Standards Agency Amendment" law.
        </h1>
      )}
    </>
  );
}
