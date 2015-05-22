import React from 'react';

import PaginationButton from './pagination_button';

let Pagination = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func.isRequired,
        currentPage: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired
        //itemListCount: React.PropTypes.number.isRequired 
    },

    render() {
        let currentPage = parseInt(this.props.currentPage, 10);

        return(
            <nav>
                <ul className="pager">
                    <PaginationButton 
                        direction='previous'
                        goToPage={this.props.goToPage}
                        currentPage={currentPage}>
                    </PaginationButton>
                    <PaginationButton 
                        direction='next'
                        goToPage={this.props.goToPage}
                        currentPage={currentPage}>
                    </PaginationButton>
                </ul>
            </nav>
        );
    }
});

export default Pagination;
