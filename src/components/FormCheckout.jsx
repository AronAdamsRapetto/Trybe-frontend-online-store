import React from 'react';
import PropTypes from 'prop-types';
import './StyleSheet/FormCheckout.css';
import UF from '../services/data';

class FormCheckout extends React.Component {
  render() {
    const { handleChange, userInfo } = this.props;
    return (
      <div className="container-inputs">
        <input
          data-testid="checkout-fullname"
          placeholder="Nome Completo"
          type="text"
          name="nome"
          value={ userInfo.nome }
          onChange={ handleChange }
        />

        <input
          data-testid="checkout-cpf"
          placeholder="CPF"
          type="text"
          name="cpf"
          value={ userInfo.cpf }
          onChange={ handleChange }
        />

        <input
          data-testid="checkout-email"
          placeholder="E-mail"
          type="email"
          name="email"
          value={ userInfo.email }
          onChange={ handleChange }
        />

        <input
          data-testid="checkout-phone"
          placeholder="Telefone"
          type="text"
          name="tel"
          value={ userInfo.tel }
          onChange={ handleChange }
        />

        <input
          data-testid="checkout-cep"
          placeholder="CEP"
          type="text"
          name="cep"
          value={ userInfo.cep }
          onChange={ handleChange }
        />

        <input
          data-testid="checkout-address"
          placeholder="Endereço"
          type="text"
          name="endereco"
          value={ userInfo.endereco }
          onChange={ handleChange }
        />

        <input
          placeholder="Complemento"
          type="text"
          name="complemento"
          value={ userInfo.complemento }
          onChange={ handleChange }
        />

        <input
          placeholder="Número"
          type="text"
          name="numero"
          value={ userInfo.numero }
          onChange={ handleChange }
        />

        <input
          placeholder="Cidade"
          type="text"
          name="cidade"
          value={ userInfo.cidade }
          onChange={ handleChange }
        />
        <select name="estado" value={ userInfo.estado } onChange={ handleChange }>
          <option value="" disabled selected>Estados</option>
          {
            UF.map(({ nome, sigla }) => (
              <option key={ sigla } value={ nome }>{sigla}</option>
            ))
          }
          <option>Estado</option>
        </select>
      </div>
    );
  }
}

FormCheckout.propTypes = {
  handleChange: PropTypes.func.isRequired,
  userInfo: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default FormCheckout;
