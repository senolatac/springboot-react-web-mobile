import React from 'react';
import AdminService from '../../services/admin.service';
import UserService from '../../services/user.service';
import $ from 'jquery';

class DeleteModal extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          user: this.props.user,
          error: '',
      };
  }

  componentDidMount() {
    const { handleDeleteModalCloseClick } = this.props;
      $(this.modal).modal('show');
      $(this.modal).on('hidden.bs.modal', handleDeleteModalCloseClick);
  }

  handleCloseClick() {
    const { handleDeleteModalCloseClick } = this.props;
    $(this.modal).modal('hide');
    handleDeleteModalCloseClick();
  }

  deleteUser(e) {
      e.preventDefault();

      const { user } = this.state;

      AdminService.deleteUser(user)
          .then(
              data => {
                  this.props.onDeleteChildUpdate(user, true);
                  this.handleCloseClick();
              },
              error => {
                this.props.onDeleteChildUpdate(null, false);
                this.setState({ error: "Unexpected error occurred.", loading: false });
              }
          );
  }

  render(){
    const { user, error } = this.state;
    return (
      <div>
      {user &&
        <div className="modal fade" id="deleteModal" ref={modal=> this.modal = modal}  tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmation</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body">
                  Are you sure to delete <strong>{user.name}</strong>?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={()=>this.handleCloseClick()}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={(e)=>this.deleteUser(e)}>I'm sure.</button>
                </div>
            </div>
          </div>
        </div>
      }
      </div>
    );
  }

}

export { DeleteModal };
