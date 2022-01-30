import React, {Component} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {styles} from '../styles/index.style';
import {ListItem} from 'react-native-elements';
import CustomHeader from '../components/header';
import UserService from '../services/user.service';

export default class ProductPage extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: true,
      title: 'Product List',
    };
  }

  componentDidMount() {
    UserService.findAllProducts()
      .then(products => {
        this.setState({
          products: products.data,
          loading: false,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  renderItem(itemProduct) {
    const {item} = itemProduct;
    return (
      <ListItem
        key={item.id}
        leftIcon={{name: 'pin-drop'}}
        onPress={() =>
          this.props.navigation.navigate('Detail', {
            productId: item.id,
            product: item,
          })
        }>
        <ListItem.Content>
          <ListItem.Title style={styles.productTitle}>
            {item.name + ' ($ ' + item.price + ')'}
          </ListItem.Title>
          <ListItem.Subtitle>{item.explanation}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.softContainer}>
        <CustomHeader
          navigation={this.props.navigation}
          title={this.state.title}
        />
        {!this.state.loading && (
          <FlatList
            data={this.state.products}
            keyExtractor={t => t.id}
            renderItem={item => this.renderItem(item)}
          />
        )}
        {this.state.loading && (
          <View style={styles.form}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    );
  }
}
