import React from 'react';

let PieceListBulkModalSelectedEditionsWidget = React.createClass({
    propTypes: {
        numberOfSelectedEditions: React.PropTypes.number.isRequired
    },

    render() {
        return (
            <span className={this.props.numberOfSelectedEditions < 1 ? 'hidden' : ''}>
                {this.props.numberOfSelectedEditions} Editions selected
            </span>
        );
    }
});

export default PieceListBulkModalSelectedEditionsWidget;