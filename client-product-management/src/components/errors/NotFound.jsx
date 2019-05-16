import React from 'react';

class NotFound extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page-wrap d-flex flex-row align-item-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 text-center">
              <span className="display-1 d-block">404</span>
              <div className="mb-4 lead">
              Oops! We can't seem to find the page you are looking for.
              <a href="/home" className="btn btn-link">Back to Home</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export {NotFound};
