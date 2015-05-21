import React from 'react';
import Router from 'react-router';

let Link = Router.Link;


let Pagination = React.createClass({

    goToPage(page) {
        return () => this.props.fetchList(page, this.props.pageSize, this.props.search,
                                          this.props.orderBy, this.props.orderAsc);
    },

    render() {
        let prev = parseInt(this.props.page, 10) - 1;
        let next = parseInt(this.props.page, 10) + 1;

        return(
            <nav>
                <ul className="pager">
                    <li className="previous">
                        <Link to="pieces"
                              query={{page: prev}}
                              onClick={this.goToPage(prev)}>
                            <span aria-hidden="true">&larr;</span>
                            Previous
                        </Link>
                    </li>
                    <li className="next">
                        <Link to="pieces"
                              query={{page: next}}
                              onClick={this.goToPage(next)}>
                            Next
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
});

export default Pagination;
