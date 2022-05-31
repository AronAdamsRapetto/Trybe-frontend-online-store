import React from 'react';
import { Link } from 'react-router-dom';
import FormCheckout from '../components/FormCheckout';
import { readSavedProducts } from '../services/storageCart';
import './StyleSheet/Checkout.css';

class Checkout extends React.Component {
  state = {
    isFinished: false,
    filteredProducts: [],
    products: [],
    totalPrice: 0,
    userInfo: {
      nome: '',
      cpf: '',
      email: '',
      tel: '',
      cep: '',
      endereco: '',
      complemento: '',
      numero: '',
      cidade: '',
      estado: '',
    },
    payOption: '',
    creditCard: '',
  };

  componentDidMount() {
    const products = readSavedProducts();
    const filteredProducts = this.filterProducts(products);
    const totalPrice = this.calculateTotalPrice(products);
    this.setState({ products, filteredProducts, totalPrice });
  }

  filterProducts = (products) => products
    .map((produto) => JSON.stringify(produto))
    .filter((produto, index, self) => self.indexOf(produto) === index)
    .map((produto) => JSON.parse(produto));

    calculateTotalPrice = (products) => products
      .reduce((accPrice, { price }) => {
        let novoAcc = accPrice;
        novoAcc += price;
        return novoAcc;
      }, 0);

  handleChangeInfos = ({ target: { value, name } }) => {
    this.setState((prevState) => ({
      userInfo: { ...prevState.userInfo, [name]: value },
    }));
  }

  handleChangePayment = ({ target: { value, name } }) => {
    this.setState({ [name]: value }, () => {
      const { payOption } = this.state;
      if (payOption === 'Boleto') {
        this.setState({ creditCard: '' });
      }
    });
  }

  handleClick = () => {
    this.setState({ isFinished: true }, () => {
      localStorage.setItem('produtosCarrinho', JSON.stringify([]));
    });
  }

  render() {
    const {
      products,
      filteredProducts,
      totalPrice,
      userInfo,
      payOption,
      creditCard,
      isFinished,
    } = this.state;
    return (
      <div>
        {
          isFinished ? (
            <section className="container-finish-message">
              <h1>Compra realizada com sucesso!</h1>
              <h3>Obrigado pela preferência! :D</h3>
              <div>
                <Link to="/">
                  <button
                    className="return-button"
                    type="button"
                  >
                    Continuar comprando
                  </button>
                </Link>
              </div>
            </section>
          ) : (
            <main>
              <nav className="container-navigation-links">
                <Link to="/" className="">Home</Link>
                <Link to="/carrinho">Voltar para carrinho</Link>
              </nav>
              <section className="container-product-list">
                <h2>Revise seu Produtos</h2>
                <hr />
                {filteredProducts.map(({ title, price, thumbnail, id }) => (
                  <div className="container-product-review" key={ id }>
                    <div>
                      <img src={ thumbnail } alt={ thumbnail } />
                      <h3>{title}</h3>
                    </div>
                    <p>
                      { `Qtd: ${products
                        .filter(({ id: idProduto }) => idProduto === id).length}` }

                    </p>
                    <p>{`R$ ${price.toFixed(2)}`}</p>
                  </div>
                ))}
                <p className="totalPrice">{ `Total: R$ ${totalPrice.toFixed(2)}` }</p>
              </section>
              <section className="container-info-user">
                <h2>Informações do Comprador</h2>
                <hr />
                <FormCheckout
                  userInfo={ userInfo }
                  handleChange={ this.handleChangeInfos }
                />
              </section>
              <section className="container-pay-method">
                <h2>Método de Pagamento</h2>
                <hr />
                <div className="container-pay-options">
                  <label htmlFor="boletoRadio">
                    <input
                      id="boletoRadio"
                      type="radio"
                      name="payOption"
                      value="Boleto"
                      onChange={ this.handleChangePayment }
                    />
                    Boleto
                  </label>
                  <label htmlFor="creditoRadio">
                    <input
                      id="creditoRadio"
                      type="radio"
                      name="payOption"
                      value="Crédito"
                      onChange={ this.handleChangePayment }
                    />
                    Cartão de Crédito
                  </label>
                  <div>
                    {
                      payOption === 'Crédito' && (
                        <section className="container-creditCard">
                          <label htmlFor="visaRadio">
                            <input
                              id="visaRadio"
                              type="radio"
                              name="creditCard"
                              value="Visa"
                              checked={ creditCard === 'Visa' }
                              onChange={ this.handleChangePayment }
                            />
                            Visa
                          </label>
                          <label htmlFor="masterRadio">
                            <input
                              id="masterRadio"
                              type="radio"
                              name="creditCard"
                              value="MasterCard"
                              checked={ creditCard === 'MasterCard' }
                              onChange={ this.handleChangePayment }
                            />
                            MasterCard
                          </label>
                          <label htmlFor="eloRadio">
                            <input
                              id="eloRadio"
                              type="radio"
                              name="creditCard"
                              value="Elo"
                              checked={ creditCard === 'Elo' }
                              onChange={ this.handleChangePayment }
                            />
                            Elo
                          </label>
                        </section>
                      )
                    }
                  </div>
                </div>
              </section>
              <button
                className="finish-button"
                type="button"
                onClick={ this.handleClick }
              >
                Comprar
              </button>
            </main>
          )
        }
      </div>
    );
  }
}
// rating: 3,

// const { rating } =this.state

// <i className={ rating >= value && "classe-pinta estrela" }

export default Checkout;
