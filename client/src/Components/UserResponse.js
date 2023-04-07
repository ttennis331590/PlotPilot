import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bulma-components";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

function UserResponse() {
  const [value, setValue] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [adBlockEnabled, setAdBlockEnabled] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    console.log(value);
  }, [value]);

  useEffect(() => {
    const checkAdblockStatus = () => {
      if (document.getElementById("xjrRuYBDKTIX")) {
        console.log("Blocking Ads: No");
        setIsReadOnly(false);
        setAdBlockEnabled(false);
      } else {
        console.log("Blocking Ads: Yes");
        setIsReadOnly(true);
        setAdBlockEnabled(true);
      }
    };

    // Run the check immediately
    checkAdblockStatus();

    // Set up an interval to periodically check ad-block status
    const intervalId = setInterval(() => {
      checkAdblockStatus();
    }, 5000); // Check every 5 seconds

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleChange = (content, delta, source, editor) => {
    const text = editor.getText().trim();
    const currentWordCount = text.length ? text.split(/\s+/).length : 0;
    if (isReadOnly) {
      if (currentWordCount <= 1000) {
        setValue(content);
        setWordCount(currentWordCount);
        setIsReadOnly(false);
      }
    } else {
      if (currentWordCount > 1000) {
        setIsReadOnly(true);
      }
      setValue(content);
      setWordCount(currentWordCount);
    }
  };

  const handleBlur = () => {
    if (adBlockEnabled) {
      quillRef.current.getEditor().focus();
    }
  };


  return (
    <div>
        <div className="quill-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        className={`editor-container ${adBlockEnabled ? "blurred" : ""}`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={isReadOnly}
      />
      {adBlockEnabled && (
        <div className="adblock-message">
          Please disable your ad-blocker to use this input.
        </div>
      )}
      </div>
      <p>Word count: {wordCount}</p>
      <Button className="submit-button mt-2" fullwidth={true}>
        Submit
      </Button>
    </div>
  );
}

export default UserResponse;
