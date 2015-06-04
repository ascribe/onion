import React from 'react';
import Router from 'react-router';

import TableColumnContentModel from '../../models/table_column_content_model';
import TableColumnMixin from '../../mixins/table_column_mixin';

let TableItemWrapper = React.createClass({
    mixins: [TableColumnMixin, Router.Navigation],
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        columnContent: React.PropTypes.object,
        columnWidth: React.PropTypes.number.isRequired
    },

    /**
     * If a link is defined in columnContent, then we can use
     * Router.Navigation.transitionTo to redirect the user
     * programmatically
     */
    transition(column) {
        if(column.link) {
            let params = {};
            params[column.link.paramsKey] = this.props.columnContent[column.link.contentKey];

            this.transitionTo(column.link.to, params);
        }
    },

    render() {
        return (
            <div>
                {this.props.columnList.map((column, i) => {

                    let TypeElement = column.displayType;
                    let typeElementProps = column.transformFn(this.props.columnContent);

                    let columnClass = this.calcColumnClasses(this.props.columnList, i, this.props.columnWidth);

                    let transition = this.transition.bind(this, column);

                    return (
                        <div 
                            className={columnClass + ' ascribe-table-item-column'} 
                            key={i}
                            onClick={transition}>
                            <TypeElement {...typeElementProps} />
                        </div>
                    );

                })}
            </div>
        );
    }
});

export default TableItemWrapper;