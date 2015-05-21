import React from 'react';

let TableHeaderItemCarret = React.createClass({
    propTypes: {
        orderAsc: React.PropTypes.bool.isRequired
    },

    render() {
        let carretDirection = 'glyphicon-triangle-';

        if(this.props.orderAsc) {
            carretDirection += 'top';
        } else {
            carretDirection += 'bottom';
        }

        return (
            <span className={'glyphicon ' + carretDirection}>
            </span>
        );
    }
});

export default TableHeaderItemCarret;