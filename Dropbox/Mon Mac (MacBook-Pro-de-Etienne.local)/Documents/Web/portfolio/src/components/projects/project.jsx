import React, { Component } from "react";
import { TiTickOutline } from "react-icons/ti";
export default class Projects extends Component {
  componentDidMount() {}
  showPerks() {
    return this.props.perks.reduce((acc, value) => {
      acc.push(
        <div className="ma2">
          <TiTickOutline /> {value}
        </div>
      );
      return acc;
    }, []);
  }
  render() {
    return (
      <div id="Projects">
        <a href={this.props.href} className="pointer">
          <h2>{this.props.name}</h2>
        </a>
        <div className="flex flex-row justify-center items-center">
          <p>
            {this.props.text} {this.showPerks()}
          </p>
          <a href={this.props.href} className="pointer">
            <img src={this.props.img} alt={this.props.name} />
          </a>
        </div>
      </div>
    );
  }
}
