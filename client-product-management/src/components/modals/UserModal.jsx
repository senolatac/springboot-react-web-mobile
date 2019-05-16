import React from 'react';
import AdminService from '../../services/admin.service';
import UserService from '../../services/user.service';
import $ from 'jquery';

class UserModal extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          user: this.props.user,
          submitted: false,
          loading: false,
          error: ''
      };
  }

  componentDidMount() {
    const { handleModalCloseClick } = this.props;
      $(this.modal).modal('show');
      $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
  }

  handleCloseClick() {
    const { handleModalCloseClick } = this.props;
    $(this.modal).modal('hide');
    handleModalCloseClick();
  }

  handleChange(e) {
      var { name, value } = e.target;
      var user = this.state.user;
      user[name] = value;
      this.setState({ user: user });
  }

  handleSubmit(e) {
      e.preventDefault();

      this.setState({ submitted: true });
      const { user } = this.state;

      // stop here if form is invalid
      if (!(user.username && user.password)) {
          return;
      }

      this.setState({ loading: true });
      if(user.id !== -1){
        this.updateUser(user);
      }else{
        this.createUser(user);
      }
  }

  createUser(user){
    UserService.register(user)
        .then(
            data => {
                console.log(data.data);
                this.props.onChildUpdate(data.data, true, false);
                this.handleCloseClick();
            },
            error => {
              this.props.onChildUpdate(null, false, false);
              this.setState({ error: "Unexpected error occurred.", loading: false });
            }
        );
  }

  updateUser(user){
    AdminService.updateUser(user)
        .then(
            data => {
                console.log(data.data);
                this.props.onChildUpdate(data.data, true, true);
                this.handleCloseClick();
            },
            error => {
              this.props.onChildUpdate(null, false, false);
              this.setState({ error: "Unexpected error occurred.", loading: false });
            }
        );
  }

  render(){
    const { user, submitted, loading, error } = this.state;
    return (
      <div>
      {user &&
      <div className="modal fade" id="userModal" tabIndex="-1" ref={modal=> this.modal = modal} role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form name="form-user-update"  onSubmit={(e)=>this.handleSubmit(e)}>
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <div className="modal-body">
                {error &&
                  <div className="alert alert-danger" role="alert">
                    <strong>Error! </strong> {error}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                }

                <div className={'form-group' + (submitted && !user.name ? ' has-error' : '')}>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" className="form-control" name="name" value={user.name} onChange={(e)=>this.handleChange(e)} />
                    {submitted && !user.name &&
                        <div className="alert alert-danger" role="alert">Name is required</div>
                    }
                </div>
                <div className={'form-group' + (submitted && !user.username ? ' has-error' : '')}>
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" name="username" value={user.username} onChange={(e)=>this.handleChange(e)} />
                    {submitted && !user.username &&
                        <div className="alert alert-danger" role="alert">Username is required</div>
                    }
                </div>

                <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                    <label htmlFor="password">Password</label>
                    <input readOnly={user.id!==-1} type="password" className="form-control" name="password" value={user.password} onChange={(e)=>this.handleChange(e)} />
                    {submitted && !user.password &&
                        <div className="alert alert-danger" role="alert">Password is required</div>
                    }
                </div>

                <div className={'form-group' + (submitted && !user.role ? ' has-error' : '')}>
                  <label htmlFor="role">User Role</label>
                  <select className="form-control" name="role" id="role" required value={user.role} onChange={(e)=>this.handleChange(e)}>
                    <option value="">Choose</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                  {submitted && !user.role &&
                      <div className="alert alert-danger" role="alert">Role is required</div>
                  }
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={()=>this.handleCloseClick()}>Close</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
    </div>
    );
  }

}

export { UserModal };
