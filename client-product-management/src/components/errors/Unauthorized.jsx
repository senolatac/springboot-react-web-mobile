import React from 'react';

class Unauthorized extends React.Component{
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="page-wrap d-flex flex-row align-item-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12 text-center">
                <span className="display-1 d-block">401</span>
                <div className="mb-4 lead">
                  Unauthorized! Access to this resource is denied.
                  <a href="/home" className="btn btn-link">Back to Home</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export {Unauthorized};
