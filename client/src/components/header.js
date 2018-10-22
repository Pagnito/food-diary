import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";
/* eslint react/prop-types: 0 */
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navState: false,
      user:{}
    };
  }
  componentDidUpdate(prevProps){
    if(prevProps.user!==this.props.user){
      this.setState({user:this.props.user})
    }
  }
  pullOutNav = () => {
    const nav = document.getElementById("pullOutNav");

    if (this.state.navState === false) {
      nav.classList.remove("pullIn");
      nav.classList.add("pullOut");
      this.setState({ navState: true });
    } else {
      nav.classList.add("pullIn");
      nav.classList.remove("pullOut");
      this.setState({ navState: false });
    }
  };
  renderHeader=()=>{
    if(Object.keys(this.state.user).length>0){
      return(
        <div className="">
          <i onClick={this.pullOutNav} id="navBtn" className="fas fa-bars" />
          <div onClick={this.pullOutNav} id="pullOutNav" className="pullOutNav from-right">
            <div className="navListWrap">
              <ul className="navBtnList">

                <li className="navItem"><Link to="/entries">Entries</Link></li>
                <li className="navItem"><Link to="dashboard" >Dash</Link></li>
                <li className="navItem"><a href="/api/logout">Log out</a></li>
              </ul>
            </div>
          </div>
        </div>
      )
    } else {
      return(
      <div className="">
        <i onClick={this.pullOutNav} id="navBtn" className="fas fa-bars" />
        <div onClick={this.pullOutNav} id="pullOutNav" className="pullOutNav from-right">
          <div className="navListWrap">
            <ul className="navBtnList">
              <li className="navItem"><Link to="/">Login</Link></li>
              <li className="navItem"><Link to="/">Register</Link></li>
            </ul>
          </div>
        </div>
      </div>
     )
    }
  }
  render() {
    return (
      <div className="">
        {this.renderHeader()}
      </div>
    );
  }
}

export default Header;
