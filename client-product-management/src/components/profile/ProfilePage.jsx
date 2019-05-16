import React from 'react';
import UserService from '../../services/user.service';

class ProfilePage extends React.Component {

  constructor(props){
    super(props);

    if(!UserService.currentUserValue){
      this.props.history.push('/');
      return;
    }

    this.state = {
      user: UserService.currentUserValue
    };
  }

  render() {
    return (
      <div className="jumbotron">
      <h1 className="display-4">Hello, {this.state.user.name}</h1>
      </div>
    );
  }
  
}

export {ProfilePage};
