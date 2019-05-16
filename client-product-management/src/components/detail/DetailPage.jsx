import React from 'react';

class DetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      product: JSON.parse(localStorage.getItem('currentProduct'))
    };
  }

  render() {
    return (
      <div className="jumbotron">
        <h1 className="display-4">Product: {this.state.product.name}</h1>
        <h1 className="display-4">Product Id: {this.state.id}</h1>
      </div>
    );
  }

}

export {DetailPage};
