import React, { Component } from 'react';
import '../styles/login.css'

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      email:'',
      password:'',
      errors:{}
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  /*componentDidMount(){
    if(Object.keys(this.state.user).length>0){
      this.props.history.push('/dashboard')
    }
  }*/
  render() {
      return (
        <div className="loginLanding">
          <div id="loginBoxWrapper">
            <h1 className="registerTitle"> Login</h1>
            <form
              onSubmit={this.login}
              autoComplete="off"
              className="form-group"
            >
              <label>Email</label>
              <input
                onChange={this.onChange}
                placeholder=''
                value={this.state.email}
                name="email"
                className="form-input"
              />

              <label>Password</label>
              <input
                type="password"
                onChange={this.onChange}
                placeholder=''
                name="password"
                value={this.state.password}
                className="form-input"
              />

              <div className="form-group-hor">
                <button className="form-btn" type="button">
                  Submit
                </button>
                <a className="form-btnLogin" href="/auth/google"><button className="form-btn" type="button">
                  Login With Google
                </button></a>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }



export default Login;
