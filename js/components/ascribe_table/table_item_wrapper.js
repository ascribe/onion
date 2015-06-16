'use strict';

import React from 'react';
import Router from 'react-router';

import { ColumnModel } from './models/table_models';

let Link = Router.Link;

let TableItemWrapper = React.createClass({
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        columnContent: React.PropTypes.object,
        columnWidth: React.PropTypes.number.isRequired
    },

    mixins: [Router.Navigation],

    render() {
        return (
            <tr>
                {this.props.columnList.map((column, i) => {

                    let TypeElement = column.displayType;
                    let typeElementProps = column.transformFn(this.props.columnContent);

                    if(!column.transition) {
                        return (
                            <td
                                className={'ascribe-table-item-column'}
                                key={i}>
                                <TypeElement {...typeElementProps} />
                            </td>
                        );
                    } else {

                        let linkProps = column.transition.toReactRouterLinkProps(this.props.columnContent[column.transition.valueKey]);
                        /**
                         * If a transition is defined in columnContent, then we can use
                         * Router.Navigation.transitionTo to redirect the user
                         * programmatically
                         */
                        return (
                            <td key={i}>
                                <Link
                                    className={'ascribe-table-item-column'}
                                    onClick={column.transition.callback}
                                    {...linkProps}>
                                    <TypeElement {...typeElementProps} />
                                </Link>
                            </td>
                        );
                    }
                })}
            </tr>
        );
    }
});

export default TableItemWrapper;