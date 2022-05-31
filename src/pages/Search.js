import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProductsFromCategoryAndQuery } from '../services/api';
import Card from '../components/Card';
import Categories from '../components/Categories';
import './StyleSheet/Search.css';
import { readSavedProducts } from '../services/storageCart';

class Search extends React.Component {
  state = {
    isLoading: false,
    inputValue: '',
    produtos: [],
    totalCarrinho: 0,
    typePrice: 'Recente',
    categoria: '',
  };

  // Altera a quantidade que aparece do lado do carrinho quando abrir a pagina
  componentDidMount() {
    this.handleAmount();
  }

  // Altera a quantidade que aparece do lado do carrinho
  handleAmount = () => {
    const total = readSavedProducts().length;
    this.setState({
      totalCarrinho: total,
    });
  }

  // Controla campo de pesquisa
  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  // Alterar categoria e atualizar a pagina
handleCategory = (event) => {
  const ideia = event.target.id;
  this.setState({
    categoria: ideia,
  }, () => { this.handleClick(); });
}

  // Realiza pesquisa a partir do campo de pesquisa e categorias
  handleClick = () => {
    const { inputValue, categoria } = this.state;
    this.setState({ isLoading: true }, async () => {
      if (inputValue.length !== 0 || categoria.length !== 0) {
        const APIResponse = await getProductsFromCategoryAndQuery(
          categoria,
          inputValue,
        );
        const response = APIResponse.results;
        this.handlePrint(response);
      }
      this.setState({ isLoading: false });
    });
  };

  // Ordenar os valores e imprimir na tela
  handlePrint = (response) => {
    const { typePrice } = this.state;
    if (typePrice === 'Recente') {
      this.setState({ produtos: response });
    }
    if (typePrice === 'Mais caro') {
      const numero = -1;
      const retorno = response.sort((a, b) => {
        if (a.price > b.price) {
          return numero;
        }
        return true;
      });
      this.setState({ produtos: retorno });
    }
    if (typePrice === 'Mais barato') {
      const numero = -1;
      const retorno = response.sort((a, b) => {
        if (a.price < b.price) {
          return numero;
        }
        return true;
      });
      this.setState({ produtos: retorno });
    }
  }

// Definir no estado a ordem dos valores
handlePrice = ({ target }) => {
  const valor = target.value;
  this.setState({
    typePrice: valor,
  });
  this.handleClick();
}

render() {
  const { inputValue, produtos, totalCarrinho, typePrice, isLoading } = this.state;
  return (
    <div className="main-container">
      <Categories handleApertar={ this.handleCategory } />
      <section className="content-container">
        {/* CAMPO DE PESQUISA E BOTÃO */}
        <div className="search-container">
          <div className="control-search">
            <input
              type="text"
              data-testid="query-input"
              name="inputValue"
              value={ inputValue }
              onChange={ this.handleChange }
            />
            <button
              data-testid="query-button"
              onClick={ this.handleClick }
              type="button"
            >
              Pesquisar
            </button>
          </div>
          {/* LINK PARA CARRINHO DE COMPRAS */}
          <Link
            to="/carrinho"
            data-testid="shopping-cart-button"
            className="link-cart"
          >
            <span>Carrinho de compras</span>
            {/* LOCAS DO CONTADOR DE ITEMS NO CARRINHO */}
            <span data-testid="shopping-cart-size">{ `${totalCarrinho} >` }</span>
          </Link>
        </div>
        {/* LISTAGEM DE PRODUTOS */}
        <article className="product-conteiner">
          <p className="initial-message" data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>
          {/* Ordenar os valores    */}
          <select
            name="typePrice"
            value={ typePrice }
            onChange={ this.handlePrice }
            className="price-filter"
          >
            <option value="Recente">Recente</option>
            <option value="Mais caro">Mais caro</option>
            <option value="Mais barato">Mais barato</option>
          </select>
          <div className="product-list">
            {
              isLoading ? <h1>Carregando...</h1> : (
                produtos.map((itens) => (
                  <Card
                    id={ itens.id }
                    key={ itens.id }
                    price={ itens.price }
                    title={ itens.title }
                    thumbnail={ itens.thumbnail }
                    produto={ itens }
                    handleAmount={ this.handleAmount }
                    freeShipping={ itens.shipping.free_shipping }
                  />
                )))
            }
          </div>
        </article>
      </section>
    </div>
  );
}
}
Search.prototypes = {
  price: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

export default Search;
