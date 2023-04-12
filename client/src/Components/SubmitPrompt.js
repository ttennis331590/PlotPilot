import React, { useState } from "react";
import { Button, Content } from "react-bulma-components";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import { Link } from "react-router-dom";

function UserResponse() {
  const [value, setValue] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleChange = (content, delta, source, editor) => {
    const text = editor.getText().trim();
    const currentCharCount = text.length;

    if (currentCharCount > 500) {
      const newText = text.slice(0, 500);
      setValue(newText);
      setCharCount(500);
    } else {
      setValue(content);
      setCharCount(currentCharCount);
    }
  };

  return (
    <div>
      <Content>
        <p className="is-size-6">
          <strong className="white-text">A few guidelines:</strong>

          <ul>
            <li className="white-text">
              Think outside the box! A prompt can be a paragraph or a single
              word - use your imagination!
            </li>
            <li className="white-text">
              Consider the scope. Writers have 4000 characters. A good prompt
              makes it easy for a writer to complete a story within their
              character limit.
            </li>
            <li className="white-text">
              Any submissions determined to contain offensive or harmful content
              will not be published.
            </li>
            <li className="white-text">
              Prompts are updated weekly. If your prompt is selected, you will
              be notified by email when it is published.
            </li>
            <li className="white-text">
              We're not against AI-generated prompts. That being said, we think
              it's best practice not to <i>directly</i> use AI-generated
              prompts, but to use them as a tool to create your own unique
              prompt.
            </li>
            <li className="white-text">
              Feel free to submit as many prompts as you like, as long as that
              number is less than 10 per week &#128578;
            </li>
          </ul>
        </p>
      </Content>
      <div className="quill-wrapper">
        <ReactQuill
          theme="snow"
          className="editor-container"
          value={value}
          onChange={handleChange}
        />
      </div>
      <p className="char-count">Character count: {charCount}/500</p>
      <Button className="submit-button mt-2" fullwidth={true}>
        Submit
      </Button>
    </div>
  );
}

export default UserResponse;
