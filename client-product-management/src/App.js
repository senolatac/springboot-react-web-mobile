import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {createBrowserHistory} from 'history';

import {HomePage} from './components/home/HomePage';
import {LoginPage} from './components/login/LoginPage';
import {RegisterPage} from './components/register/RegisterPage';
import {ProfilePage} from './components/profile/ProfilePage';
import {DetailPage} from './components/detail/DetailPage';
import {AdminPage} from './components/admin/AdminPage';
import {NotFound} from './components/errors/NotFound';
import {Unauthorized} from './components/errors/Unauthorized';

import AuthGuard from './guards/AuthGuard';
import {Role} from './models/role';

import UserService from './services/user.service';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faUserPlus, faSignInAlt, faHome, faSignOutAlt, faUserShield} from '@fortawesome/free-solid-svg-icons';

class App extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      history: createBrowserHistory(),
      currentUser: null,
      isAdmin: false,
      currentLocation: window.location.pathname
    };
  }

  componentWillMount() {
    this.unlisten = this.state.history.listen((location, action) => {
      this.setState({currentLocation: location.pathname})
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidMount() {
    UserService.currentUser.subscribe(data => {
      this.setState({
        currentUser: data,
        isAdmin: data && data.role === Role.ADMIN
      })
    });
  }

  logout() {
    UserService.logOut()
    .then(
      data => {
        this.state.history.push('/home');
      },
      error => {
        this.setState({
          errorMessage: "Unexpected error occurred"
        });
      }
    );
  }

  render(){
    const {currentUser, isAdmin, history, currentLocation} = this.state;
    return (
        <Router history={history}>
          <div>
          {this.state.currentUser &&
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <a className="navbar-brand" href="https://reactjs.org">
                <img src={logo} className="App-logo" alt="logo"/>
                React
              </a>
              <div className="navbar-nav mr-auto">
                <Link to="/home" className={currentLocation == '/home' ? 'nav-item nav-link active': 'nav-item nav-link'}><FontAwesomeIcon icon={faHome}/> Home</Link>
                {this.state.isAdmin && <Link to="/admin" className={currentLocation == '/admin' ? 'nav-item nav-link active': 'nav-item nav-link'}><FontAwesomeIcon icon={faUserShield}/> Admin</Link>}
              </div>

              <div className="navbar-nav ml-auto">
                <Link to="/profile" className={currentLocation == '/profile' ? 'nav-item nav-link active': 'nav-item nav-link'}><FontAwesomeIcon icon={faUser}/> {currentUser.name}</Link>
                <a onClick={()=>this.logout()} className="nav-item nav-link"><FontAwesomeIcon icon={faSignOutAlt}/> LogOut</a>
              </div>
            </nav>
          }

          {!this.state.currentUser &&
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <a className="navbar-brand" href="https://reactjs.org">
                <img src={logo} className="App-logo" alt="logo"/>
                React
              </a>
              <div className="navbar-nav mr-auto">
                <Link to="/home" className={currentLocation == '/home' ? 'nav-item nav-link active': 'nav-item nav-link'}><FontAwesomeIcon icon={faHome}/> Home</Link>
              </div>

              <div className="navbar-nav ml-auto">
                <Link to="/register" className={currentLocation == '/register' ? 'nav-item nav-link active': 'nav-item nav-link'}><FontAwesomeIcon icon={faUserPlus}/> Register</Link>
                <Link to="/login" className={currentLocation == '/login' ? 'nav-item nav-link active': 'nav-item nav-link'}><FontAwesomeIcon icon={faSignInAlt}/> Login</Link>
              </div>
            </nav>
          }
          <div className="container">
            <Switch>
              <Route exact path="/" component={HomePage}/>
              <Route exact path="/home" component={HomePage}/>
              <Route exact path="/login" component={LoginPage}/>
              <Route exact path="/register" component={RegisterPage}/>
              <AuthGuard path="/profile" roles={[Role.ADMIN, Role.USER]} component={ProfilePage}/>
              <Route exact path="/detail/:id" component={DetailPage}/>
              <AuthGuard path="/admin" roles={[Role.ADMIN]} component={AdminPage}/>
              <Route exact path="/404" component={NotFound}/>
              <Route exact path="/401" component={Unauthorized}/>
              <Redirect from='*' to='/404' />
            </Switch>
          </div>
          </div>
        </Router>
    );
  }
}

export default App;
