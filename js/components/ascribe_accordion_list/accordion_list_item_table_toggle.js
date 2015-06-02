import React from 'react';

let AccordionListItemTableToggle = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        onClick: React.PropTypes.func,
        show: React.PropTypes.bool,
        numOfTableItems: React.PropTypes.number
    },

    render() {
        return (
            <span 
                className={this.props.className}
                onClick={this.props.onClick}>
                {this.props.show ? 'Hide all ' + this.props.numOfTableItems + ' Editions' : 'Show all ' + this.props.numOfTableItems + ' Editions'}
            </span>
        );
    }
});

export default AccordionListItemTableToggle;