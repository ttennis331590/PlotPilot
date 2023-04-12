import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bulma-components";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import { Link } from "react-router-dom";

function UserResponse() {
  const [value, setValue] = useState("");
  const [charCount, setCharCount] = useState(0);
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
    const currentCharCount = text.length;
    if (currentCharCount > 4000) {
      const newText = text.slice(0, 4000);
      setValue(newText);
      setCharCount(4000);
    } else {
      setValue(content);
      setCharCount(currentCharCount);
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
            Please disable your ad-blocker or&nbsp;
            <Link to="https://platform.openai.com/account/api-keys" target="_blank">
              provide an OpenAI API key
            </Link>
            &nbsp;to use this input.
          </div>
        )}
      </div>
      <p className="char-count">Character count: {charCount}/4000</p>
      <Button className="submit-button mt-2" fullwidth={true}>
        Submit
      </Button>
    </div>
  );
}

export default UserResponse;
