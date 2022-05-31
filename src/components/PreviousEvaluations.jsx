import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './StyleSheet/PreviousEvaluations.css';

class PreviousEvaluations extends Component {
  render() {
    const { evaluations } = this.props;
    const ratingStars = ['1', '2', '3', '4', '5'];
    return (
      <div>
        {
          evaluations.map(({ email, rating, message }) => (
            <div className="evaluation-submited" key={ email }>
              <p>{email}</p>
              <hr />
              {ratingStars.map((value) => (
                <i
                  key={ value }
                  data-testid={ `${value}-rating` }
                  id={ value }
                  className={ rating >= value && 'rating-selected' }
                >
                  &#x02606;
                </i>
              ))}
              <p>{message}</p>
            </div>
          ))
        }
      </div>
    );
  }
}

PreviousEvaluations.propTypes = {
  evaluations: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default PreviousEvaluations;
