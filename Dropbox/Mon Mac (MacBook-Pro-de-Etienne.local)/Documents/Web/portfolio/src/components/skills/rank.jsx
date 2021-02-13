import React, { Component } from "react";
import { gsap } from "gsap";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";
import { RiForbidLine } from "react-icons/ri";
export default class Rank extends Component {
  constructor(props) {
    super(props);
    let stars = [];
    for (let i = 0; i < 5; i++) {
      const delta = Math.round((this.props.rank - i) * 2) / 2;
      if (delta <= 0) {
        stars.push(
          <TiStarOutline size={this.props.size ? this.props.size : 30} />
        );
      } else if (delta <= 0.5) {
        stars.push(
          <TiStarHalfOutline size={this.props.size ? this.props.size : 30} />
        );
      } else {
        stars.push(
          <TiStarFullOutline size={this.props.size ? this.props.size : 30} />
        );
      }
    }
    this.state = { stars };
  }
  render() {
    return <div className={this.props.class}>{this.state.stars}</div>;
  }
}
