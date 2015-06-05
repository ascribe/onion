'use strict';

import React from 'react';

import PaginationButton from './pagination_button';

let Pagination = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func.isRequired,
        currentPage: React.PropTypes.number.isRequired,
        totalPages: React.PropTypes.number.isRequired
        //itemListCount: React.PropTypes.number.isRequired
    },

    render() {
        return (
            <nav>
                <ul className="pager">
                    <PaginationButton
                        direction='previous'
                        goToPage={this.props.goToPage}
                        currentPage={this.props.currentPage}
                        totalPages={this.props.totalPages} />
                    <PaginationButton
                        direction='next'
                        goToPage={this.props.goToPage}
                        currentPage={this.props.currentPage}
                        totalPages={this.props.totalPages} />
                </ul>
            </nav>
        );
    }
});

export default Pagination;
