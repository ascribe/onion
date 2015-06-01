import React from 'react';

import TableColumnContentModel from '../../models/table_column_content_model';
import TableColumnMixin from '../../mixins/table_column_mixin';

let TableItemWrapper = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
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

                    return (
                        <div className={columnClass + ' ascribe-table-item-column'} key={i}>
                            <TypeElement {...typeElementProps} />
                        </div>
                    );

                })}
            </div>
        );
    }
});

export default TableItemWrapper;