import React from 'react';
import PropTypes from 'prop-types';
import './StyleSheet/ProductDetails.css';
import { Link } from 'react-router-dom';
import { saveProduct, readSavedProducts } from '../services/storageCart';
import EvaluationForm from '../components/EvaluationForm';

class ProductDetails extends React.Component {
  state = {
    produto: {},
    atributos: [],
    availableQuantity: '',
    imagem: '',
    totalCarrinho: 0,
    freeShipping: [],
  }

  async componentDidMount() {
    // Altera a quantidade que aparece do lado do carrinho quando abrir a pagina
    this.handleAmount();
    await this.fetchProduct();
  }

  fetchProduct = async () => {
    const { match: { params: { id } } } = this.props;
    const url = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(url);
    const produto = await response.json();
    this.setState({
      produto,
      atributos: produto.attributes,
      imagem: produto.pictures.find((_picture, index) => index === 0).url,
      availableQuantity: produto.available_quantity,
      freeShipping: produto.shipping.free_shipping,
    });
  }

  // Salva produto no LocalStorage
  handleClick = () => {
    const { produto } = this.state;
    saveProduct(produto);
  }

  // Altera a quantidade que aparece do lado do carrinho
  handleAmount = () => {
    const total = readSavedProducts().length;
    this.setState({
      totalCarrinho: total,
    });
  }

  render() {
    const {
      produto: {
        title,
        price,
        original_price: totalPrice,
      },
      atributos,
      imagem,
      availableQuantity,
      totalCarrinho,
      freeShipping,
    } = this.state;
    return (
      <section className="container-product">
        {/* LINKS DE NAVEGAÇÃO */}
        <nav className="container-nav">
          <Link to="/" className="link-home">{'< Home'}</Link>
          <div>
            <Link
              to="/carrinho"
              data-testid="shopping-cart-button"
              // CLASSE ESTILIZADA NO SEARCH.CSS
              className="link-cart"
            >
              <span>Carrinho de compras</span>
              <span data-testid="shopping-cart-size">{ `${totalCarrinho} >` }</span>
            </Link>
          </div>
        </nav>
        {/* DETALHES DO PRODUTO */}
        <section className="container-info-product">
          <div className="container-image">
            <img src={ imagem } alt="Imagem do produto" />
          </div>

          <div className="container-details">
            <h2 data-testid="product-detail-name">{ title }</h2>
            <p>{ `R$ ${price}` }</p>
            <span>{ `Estoque: ${availableQuantity} `}</span>
            { freeShipping ? (<span data-testid="free-shipping">Frete grátis</span>)
              : ('') }
            <ul className="container-list-details">
              {
                atributos.map(({ name, value_name: value, id }) => (
                  <div className="container-item-list" key={ id }>
                    <li className="item-list">{` ${name}: ${value} `}</li>
                  </div>
                ))
              }
            </ul>
          </div>
        </section>
        <section className="section-evaluation">
          <div className="container-evaluation">
            <h1>Avaliações</h1>
            <EvaluationForm />
          </div>
          {
            totalPrice ? (
              <div className="add-carrinho">
                <p className="discount">{ `De: R$ ${totalPrice}` }</p>
                <p>{ `Por: R$ ${price}` }</p>
                <button
                  data-testid="product-detail-add-to-cart"
                  type="button"
                  onClick={ this.handleClick }
                >
                  Adicionar ao carrinho
                </button>
              </div>
            ) : (
              <div className="add-carrinho">
                <p>{ `Por: R$ ${price}` }</p>
                <button
                  data-testid="product-detail-add-to-cart"
                  type="button"
                  onClick={ this.handleClick }
                >
                  Adicionar ao carrinho
                </button>
              </div>
            )
          }
        </section>

      </section>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductDetails;
