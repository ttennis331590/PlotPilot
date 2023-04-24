import React from "react";
import {
  Container,
  Content,
  Heading,
  Columns,
  Image,
  Hero,
} from "react-bulma-components";
import writingImage from "../Images/2x/art1.png";
import aiImage from "../Images/2x/AIWriting.png";
import communityImage from "../Images/2x/art3.png";

function About() {
  return (
    <Container>

      <Columns className="about-border about-border-top is-vcentered">
        <Columns.Column size="half">
          <Content className="white-text spacing">
            <Heading size={3} className="has-text-centered white-text">
              What is PlotPilot?
            </Heading>
            <p className="has-text-centered is-size-5">
              PlotPilot is a versatile platform that caters to writers of all
              skill levels, providing engaging writing prompts and valuable
              AI-powered feedback. Our supportive environment encourages you to
              expand your creative horizons and refine your writing abilities,
              no matter where you are on your writing journey.
            </p>
            <p className="has-text-centered is-size-5">
              Embracing the idea that storytelling is a fulfilling adventure
              encompassing self-discovery, growth, and expression, PlotPilot
              offers a welcoming community for all writers. Here, you can submit
              writing prompts or stories, delve into the captivating world of
              narratives shared by others, and learn from the diverse
              experiences and perspectives of fellow writers.
            </p>
          </Content>
        </Columns.Column>
        <Columns.Column size="half">
          <Image src={writingImage} className="p-6" />
        </Columns.Column>
      </Columns>

      <Columns className="about-border is-vcentered ">
        <Columns.Column size="half">
          <Image src={aiImage} className="p-6" />
        </Columns.Column>
        <Columns.Column size="half">
          <Content className="white-text spacing">
            <Heading size={3} className="has-text-centered white-text">
              The Power of AI Feedback
            </Heading>
            <p className="has-text-centered is-size-5">
              OpenAI's state of the art GPT-3.5 evaluates your stories across
              five key parameters: Plot Development, Character Development,
              Grammar &amp; Spelling, Unique Writing Style, and Emotional
              Impact. Alongside a detailed rating, GPT-3.5 provides actionable
              suggestions for improvement, explaining its rationale for the
              scores given.
            </p>
          </Content>
        </Columns.Column>
      </Columns>

      <Columns className="about-border  is-vcentered">
        <Columns.Column size="half">
          <Content className="white-text spacing has-text-centered">
            <Heading size={3} className="white-text spacing has-text-centered">Join the PlotPilot Community</Heading>
            <p className="has-text-centered is-size-5">
              By joining the PlotPilot community, you'll unlock a world of
              opportunities to grow and thrive as a writer. You'll enhance your
              storytelling skills through valuable feedback from our AI, which
              boasts extensive literary knowledge. Connect with like-minded
              writers, share inspiration, and engage in a dynamic creative
              environment where you can explore captivating stories across
              various genres and styles to spark your own imagination. As a
              member of PlotPilot, you'll also witness the growth of AI-powered
              literary assessment and have the opportunity to contribute to its
              ongoing refinement and improvement.
            </p>
          </Content>
        </Columns.Column>
        <Columns.Column size="half">
          <Image src={communityImage} className="p-6"/>
        </Columns.Column>
      </Columns>

      <Content className="white-text spacing has-text-centered">
        <Heading size={3}  className="white-text spacing has-text-centered">
          Get Involved in the Future of AI and Literature
        </Heading>
        <p className="has-text-centered is-size-5">
          We acknowledge that our AI rating system is not infallible, and we
          actively encourage users to suggest new parameters and ideas for
          refining the evaluation process. At PlotPilot, we're not only
          dedicated to fostering a vibrant community of storytellers but also to
          advancing the potential of AI in the literary world.
        </p>
        <p className="has-text-centered is-size-5">
          So, why wait? Join PlotPilot today and embark on an unforgettable
          adventure of creativity, growth, and endless storytelling
          possibilities!
        </p>
      </Content>
    </Container>
  );
}

export default About;
