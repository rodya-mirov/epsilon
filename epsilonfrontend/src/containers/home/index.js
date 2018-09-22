import React from 'react';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import {
  increment,
  decrement,
  incrementAsync,
  decrementAsync,
} from '../../modules/counter';
import PropTypes from 'prop-types';

const Home = props => (
  <div className="container">
    <h1 className="mt-5">Home Part!</h1>

    <p>There is a counter here, it goes up and down sometimes.</p>
    <p>
      This is from a sample app, and I&apos;m leaving it in as an example of
      nontrivial source code for me to imitate.
    </p>

    <p>Count: {props.count}</p>
    <p>Extant Increment requests: {props.incrementRequests}</p>
    <p>Extant Decrement requests: {props.decrementRequests}</p>

    <table>
      <tbody>
        <tr>
          <td>
            <button className="btn btn-secondary" onClick={props.increment}>
              Increment!
            </button>
          </td>
          <td>
            <button className="btn btn-secondary" onClick={props.decrement}>
              Decrement!
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button
              className="btn btn-secondary"
              onClick={props.incrementAsync}
            >
              Increment! Later!
            </button>
          </td>
          <td>
            <button
              className="btn btn-secondary"
              onClick={props.decrementAsync}
            >
              Decrement! Later!
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

Home.propTypes = {
  count: PropTypes.number,
  incrementRequests: PropTypes.number,
  decrementRequests: PropTypes.number,
  increment: PropTypes.func,
  decrement: PropTypes.func,
  incrementAsync: PropTypes.func,
  decrementAsync: PropTypes.func,
};

const mapStateToProps = ({ counter, }) => ({
  count: counter.count,
  incrementRequests: counter.incrementRequests,
  decrementRequests: counter.decrementRequests,
  isIncrementing: counter.isIncrementing,
  isDecrementing: counter.isDecrementing,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      decrement,
      incrementAsync,
      decrementAsync,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
