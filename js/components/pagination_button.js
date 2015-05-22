import React from 'react';
import Router from 'react-router';

let Link = Router.Link;

let PaginationButton = React.createClass({
    propTypes: {
        direction: React.PropTypes.oneOf(['previous', 'next']),
        goToPage: React.PropTypes.func.isRequired
    },

    render() {
        let page = parseInt(this.props.page, 10);
        let directionDisplay;

        if(this.props.direction === 'previous') {
            page -= 1;
            directionDisplay = (
                <span>
                    <span aria-hidden="true">&larr;</span> Previous
                </span>
                );
        } else {
            page += 1;
            directionDisplay = (
                <span>
                    Next <span aria-hidden="true">&rarr;</span>
                </span>
                );
        }

        return (
            <li className={this.props.direction}>
                <Link to="pieces"
                      query={{page}}
                      onClick={this.props.goToPage(page)}>
                    {directionDisplay}
                </Link>
            </li>
        );
    }
});

export default PaginationButton;