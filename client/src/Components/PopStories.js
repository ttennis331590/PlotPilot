import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Columns, Content, Heading } from 'react-bulma-components';

function Stories() {
  const [currentPromptStories, setCurrentPromptStories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/currentPromptStories")
      .then((response) => response.json())
      .then((data) => {
        setCurrentPromptStories(data);
      });
  }, []);

  useEffect(() => {
    console.log(currentPromptStories);
     }, [currentPromptStories]);

  const groupByPrompt = (stories) => {
    return stories.reduce((grouped, story) => {
      const promptId = story.prompt.id;
      if (!grouped[promptId]) {
        grouped[promptId] = {
          prompt: story.prompt,
          stories: [],
        };
      }
      grouped[promptId].stories.push(story);
      return grouped;
    }, {});
  };

  const groupedStories = groupByPrompt(currentPromptStories);
  useEffect(() => {
    console.log(groupedStories);
    }, [groupedStories]);

    const sortedGroupedStories = Object.values(groupedStories).sort(
        (a, b) => b.stories.length - a.stories.length
    );


  return (
    <div>
      <Heading size={3} className="has-text-centered">
        User Stories
      </Heading>
      {Object.values(sortedGroupedStories).map((group) => (
        <div key={group.prompt.id}>
          <Heading size={4} className="has-text-centered">
            Prompt: {group.prompt.content}
          </Heading>
          <Columns>
            {group.stories.map((story) => (
              <Columns.Column key={story.id} size="one-third">
                <Box>
                  <Heading size={4}>Title</Heading>
                  <Heading subtitle size={6}>
                    by {story.author ? story.author.name : 'Unknown'}
                  </Heading>
                  <Content>
                    <p>{story.content}</p>
                  </Content>
                </Box>
              </Columns.Column>
            ))}
          </Columns>
        </div>
      ))}
    </div>
  );
}

export default Stories;
