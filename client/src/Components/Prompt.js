import React, { useEffect, useState } from "react";
import { Box, Content, Heading } from "react-bulma-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "./UserContext";

function Prompt() {
  const [prompt, setPrompt] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [writingPrompts, setWritingPrompts] = useState([]);
  const [promptLiked, setPromptLiked] = useState(false);
  const [promptFavorited, setPromptFavorited] = useState(false);
  const { user, setUser } = useUser();

  useEffect(() => {
    fetch("http://localhost:3001/currentPrompts")
      .then((response) => response.json())
      .then((data) => {
        setWritingPrompts(data);
      });
  }, []);

  function nextPrompt() {
    if (promptIndex < writingPrompts.length - 1)
      setPromptIndex(promptIndex + 1);
    else setPromptIndex(0);
  }
  function prevPrompt() {
    if (promptIndex > 0) setPromptIndex(promptIndex - 1);
    else setPromptIndex(writingPrompts.length - 1);
  }

  useEffect(() => {
    console.log(promptIndex);
  }, [promptIndex]);

  async function toggleLikePrompt(promptId, isLiked) {
    try {
      const response = await fetch(isLiked ? "http://localhost:3001/unlikePrompt" : "http://localhost:3001/likePrompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, promptId }),
      });

      if (response.ok) {
        console.log(isLiked ? "Prompt unliked" : "Prompt liked");
        setUser({
          ...user,
          likedPrompts: isLiked
            ? user.likedPrompts.filter((prompt) => prompt !== promptId)
            : [...user.likedPrompts, promptId],
        });
      } else {
        console.error("Error liking/unliking prompt");
      }
    } catch (error) {
      console.error("Error liking/unliking prompt:", error);
    }
  }

  return (
    <>
    <Heading className="white-text">Pick a Prompt:</Heading>
      <Box className="mb-2" style={{ position: "relative" }}>
        <Content>
          <p className="is-size-5">
            {writingPrompts.length > 0 && writingPrompts[promptIndex].content}
          </p>
        </Content>
        <div
          className="like-dislike-buttons"
          style={{ position: "absolute", bottom: 10, right: 10 }}
        >
          <FontAwesomeIcon
            icon={faThumbsUp}
            size="lg"
            className={`prompt-buttons ${promptLiked ? "has-text-info" : ""}`}
            onClick={() => {
              toggleLikePrompt(writingPrompts[promptIndex].id, promptLiked);
              setPromptLiked(!promptLiked);
            }}
          />
          &nbsp; &nbsp;
          <FontAwesomeIcon
            icon={faStar}
            size="lg"
            className={`prompt-buttons ${
              promptFavorited ? "has-text-warning": ""
            }`}
            onClick={() => {
              // Replace with your favorite/unfavorite logic
              setPromptFavorited(!promptFavorited);
            }}
          />
        </div>
      </Box>
      <div className="is-flex is-justify-content-center mb-2">
        <FontAwesomeIcon
          icon={faAngleLeft}
          size="2x"
          onClick={prevPrompt}
          className="has-text-white"
        />
        <p className="has-text-white is-size-5">
          {writingPrompts.length > 0 && promptIndex + 1}/{writingPrompts.length}
        </p>
        <FontAwesomeIcon
          icon={faAngleRight}
          size="2x"
          onClick={nextPrompt}
          className="has-text-white"
        />
      </div>
    </>
  );
}
export default Prompt;
