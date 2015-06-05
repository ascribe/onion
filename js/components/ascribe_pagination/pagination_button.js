'use strict';

import React from 'react';
import Router from 'react-router';

import { getLangText } from '../../utils/lang_utils';

let Link = Router.Link;

let PaginationButton = React.createClass({
    propTypes: {
        direction: React.PropTypes.oneOf(['previous', 'next']),
        goToPage: React.PropTypes.func.isRequired,
        currentPage: React.PropTypes.number.isRequired,
        totalPages: React.PropTypes.number.isRequired
    },

    isInRange(page) {
        return page > 0 && page <= this.props.totalPages;
    },

    render() {
        let directionDisplay;
        let page = this.props.currentPage;
        let isDisabled = '';
        let anchor;

        if(this.props.direction === 'previous') {
            page -= 1;
            directionDisplay = (
                <span>
                    <span aria-hidden="true">&larr;</span> {getLangText('Previous')}
                </span>
                );
        } else {
            page += 1;
            directionDisplay = (
                <span>
                    {getLangText('Next')} <span aria-hidden="true">&rarr;</span>
                </span>
                );
        }

        if (this.isInRange(page)) {
            anchor = (
                <Link to="pieces"
                      query={{page}}
                      onClick={this.props.goToPage(page)}>
                    {directionDisplay}
                </Link>
            );
        } else {
            isDisabled += ' disabled';
            anchor = (
                <a>
                    {directionDisplay}
                </a>
            );
        }

        return (
            <li className={this.props.direction + isDisabled }>
                {anchor}
            </li>
        );
    }
});

export default PaginationButton;
