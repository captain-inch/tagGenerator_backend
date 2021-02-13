import React, { Component } from "react";
import Project from "./project.jsx";

import { AiOutlineFundProjectionScreen } from "react-icons/ai";
export default class Projects extends Component {
  componentDidMount() {}
  render() {
    return (
      <div id="Projects">
        <h1>
          <AiOutlineFundProjectionScreen />{" "}
          <span className="pa3">Projects</span>
        </h1>
        <Project
          name="Tag Generator"
          href="https://taggenerator.herokuapp.com/"
          text="Use AI to generate tags from an image url"
          perks={[
            "React",
            "API",
            "AI",
            "Postgre SQL",
            "Node.js server",
            "Responsive",
          ]}
          img={null}
        />
        <Project
          name="Tag Generator"
          href="https://captain-inch.github.io/background-generator/"
          text="First project"
          perks={["Javascript", ""]}
          img={null}
        />
        <Project
          name="Wineyard company page"
          href="https://captain-inch.github.io/lcc_export/"
          text="Fully responsive React App designed for a wineyard. The concept was to create a B2B web-App, introducing their products, story and their specificities, so that companies could inquire them."
          perks={["Real-world project", "React", "Responsive"]}
          img={null}
        />
        <span>https://captain-inch.github.io/background-generator/</span>
      </div>
    );
  }
}
