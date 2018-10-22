import React, { Component } from "react";
import axios from 'axios'
import { Route, withRouter } from "react-router-dom";
//import Loadable from 'react-loadable';
import Loader from './loader'
import Header from "./header";
import '../styles/noMaze.css';
import Entries from "./entries";
import Dashboard from "./dashboard"
import Login from "./login";
const Loading = () => Loader;

/*const Entries = Loadable({
  loader: () => import('./entries'),
  loading: Loading(),
});*/

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      user:{}
    }
  }
  componentDidMount() {
    axios.get('/api/current_user').then(res=>{
      this.setState({user:res.data},()=>{
        if(Object.keys(this.state.user).length>0){
          this.props.history.push('/dashboard')
        }
      })
    });

  }
  render() {
    return (


          <div>
            <Header user={this.state.user}/>
            <Route
              exact
              path="/dashboard"
              render={props => <Dashboard {...props} user={this.state.user} />}
            />
            <Route
              exact
              path="/entries"
              render={props => <Entries {...props} user={this.state.user} />}
            />
            <Route exact path="/" component={Login}/>
          </div>


    );
  }
}

export default withRouter(App);
