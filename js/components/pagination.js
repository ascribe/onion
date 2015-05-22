import React from 'react';

import PaginationButton from './pagination_button';

let Pagination = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func.isRequired
    },

    render() {
        let prev = parseInt(this.props.page, 10) - 1;
        let next = parseInt(this.props.page, 10) + 1;

        return(
            <nav>
                <ul className="pager">
                    <PaginationButton 
                        direction='previous'
                        goToPage={this.props.goToPage}>
                    </PaginationButton>
                    <PaginationButton 
                        direction='next'
                        goToPage={this.props.goToPage}>
                    </PaginationButton>
                </ul>
            </nav>
        );
    }
});

export default Pagination;
