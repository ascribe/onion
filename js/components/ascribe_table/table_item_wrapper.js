'use strict';

import React from 'react';
import { Link } from 'react-router';

import { ColumnModel } from './models/table_models';


let TableItemWrapper = React.createClass({
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        columnContent: React.PropTypes.object,
        columnWidth: React.PropTypes.number.isRequired,
        onClick: React.PropTypes.func
    },

    render() {
        return (
            <tr onClick={this.props.onClick}>
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

                        let linkString = column.transition.toReactRouterLink(this.props.columnContent[column.transition.valueKey]);
                        /**
                         * If a transition is defined in columnContent, then we can use
                         * Router.Navigation.transitionTo to redirect the user
                         * programmatically
                         */
                        return (
                            <td key={i} className={column.className}>
                                <Link
                                    to={linkString}
                                    className={'ascribe-table-item-column'}
                                    onClick={column.transition.callback}>
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