import React from 'react';
import UserService from '../../services/user.service';
import {User} from '../../models/user';
import {Transaction} from '../../models/transaction';

class HomePage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      products: [],
      errorMessage: '',
      infoMessage: '',
      currentUser: new User(),
    };
  }

  componentDidMount() {
    UserService.currentUser.subscribe(data =>{
      this.setState({
        currentUser: data
      })
    });

    this.setState({
      products: {loading: true}
    });

    UserService.findAllProducts().
      then(products => {
        this.setState({products: products.data});
      });
  }

  purchaseProduct(product) {
    if(!this.state.currentUser){
      this.setState({errorMessage: "You should sign in to purchase a product"});
      return;
    }

    var transaction = new Transaction(this.state.currentUser, product);
    UserService.purchaseProduct(transaction)
      .then(data => {
        this.setState({infoMessage: "Mission is completed."});
      },error => {
        this.setState({errorMessage: "Unexpected error occurred."});
      });
  }

  detail(product) {
    localStorage.setItem('currentProduct', JSON.stringify(product));
    this.props.history.push('/detail/'+product.id);
  }

  render() {
    const {products, infoMessage, errorMessage} = this.state;
    return (
      <div className="col-md-12">
      {infoMessage &&
        <div className="alert alert-success">
          <strong>Successfull! </strong> {infoMessage}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      }
      {errorMessage &&
        <div className="alert alert-danger">
          <strong>Error! </strong> {errorMessage}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      }
      {products.loading && <em> Loading products...</em>}
      {products.length &&
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Detail</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) =>
                <tr key={product.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{product.name}</td>
                  <td>{'$ ' + product.price}</td>
                  <td>
                    <button className="btn btn-info" onClick={() => this.detail(product)}>Detail</button>
                  </td>
                  <td>
                    <button className="btn btn-success" onClick={() => this.purchaseProduct(product)}>Purchase</button>
                  </td>
                </tr>
            )
            }
          </tbody>
        </table>
      }
      </div>
    );
  }

}

export {HomePage};
