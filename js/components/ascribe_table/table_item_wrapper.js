import React from 'react';
import Router from 'react-router';

import { ColumnModel } from './models/table_models';
import TableColumnMixin from '../../mixins/table_column_mixin';

let Link = Router.Link;

let TableItemWrapper = React.createClass({
    mixins: [TableColumnMixin, Router.Navigation],
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        columnContent: React.PropTypes.object,
        columnWidth: React.PropTypes.number.isRequired
    },

    render() {
        return (
            <div>
                {this.props.columnList.map((column, i) => {

                    let TypeElement = column.displayType;
                    let typeElementProps = column.transformFn(this.props.columnContent);

                    let columnClass = this.calcColumnClasses(this.props.columnList, i, this.props.columnWidth);

                    //
                    

                    if(!column.transition) {
                        return (
                            <div
                                className={columnClass + ' ascribe-table-item-column'} 
                                key={i}>
                                <TypeElement {...typeElementProps} />
                            </div>
                        );
                    } else {

                        let linkProps = column.transition.toReactRouterLinkProps(this.props.columnContent[column.transition.valueKey]);
                        /**
                         * If a transition is defined in columnContent, then we can use
                         * Router.Navigation.transitionTo to redirect the user
                         * programmatically
                         */
                        return (
                            <Link 
                                className={columnClass + ' ascribe-table-item-column'} 
                                key={i}
                                onClick={column.transition.callback}
                                {...linkProps}>
                                <TypeElement {...typeElementProps} />
                            </Link>
                        );
                    }
                })}
            </div>
        );
    }
});

export default TableItemWrapper;