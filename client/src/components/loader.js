import React, { Component } from "react";

export class Loader extends Component {
  render() {
    return (
      <div className="loader">
        <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
      </div>
    );
  }
}

export default Loader;
