import React from 'react';

/**
 * This is the component that implements display-specific functionality
 */
let PieceDetail = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <p>Title: {this.props.title}</p>
    );
  }
});

export default PieceDetail;