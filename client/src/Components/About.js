import React from "react";
import { Box, Container, Content, Heading } from "react-bulma-components";

function About() {
  return (
    <Container>
      <Box>
        <Heading>
          Welcome to PlotPilot, where creativity takes flight!
        </Heading>
        <Content>
          <p>
            PlotPilot is a one-of-a-kind platform that empowers aspiring writers
            to explore their imagination and hone their craft through engaging
            writing prompts and constructive AI-powered feedback.
          </p>
          <p>
            At PlotPilot, we believe that storytelling is a journey of
            self-discovery, growth, and expression. Here, users can submit
            writing prompts or stories, and dive into the captivating world of
            narratives created by fellow writers.
          </p>
          <p>
            Our state-of-the-art AI, GPT-3.5, evaluates your stories across five
            key parameters: Plot Development, Character Development, Grammar
            &amp; Spelling, Unique Writing Style, and Emotional Impact.
            Alongside a detailed rating, GPT-3.5 provides actionable suggestions
            for improvement, explaining its rationale for the scores given.
          </p>
          <p>
            By participating in the PlotPilot community, you'll enjoy numerous
            benefits such as:
          </p>
          <ol>
            <li>
              Enhancing your storytelling skills by receiving valuable feedback
              from an AI with extensive literary knowledge.
            </li>
            <li>
              Connecting with fellow writers, sharing inspiration, and engaging
              in a dynamic creative environment.
            </li>
            <li>
              Discovering captivating stories across various genres and styles,
              stimulating your own creativity.
            </li>
            <li>
              Witnessing the growth of AI-powered literary assessment and having
              the opportunity to contribute to its improvement.
            </li>
          </ol>
          <p>
            We acknowledge that our AI rating system is not infallible, and we
            actively encourage users to suggest new parameters and ideas for
            refining the evaluation process. At PlotPilot, we're not only
            dedicated to fostering a vibrant community of storytellers but also
            to advancing the potential of AI in the literary world.
          </p>
          <p>
            So, why wait? Join PlotPilot today and embark on an unforgettable
            adventure of creativity, growth, and endless storytelling
            possibilities!
          </p>
        </Content>
      </Box>
    </Container>
  );
}

export default About;
