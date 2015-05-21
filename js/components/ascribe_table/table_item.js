import React from 'react';

import TableColumnMixin from '../../mixins/table_column_mixin';
import TableItemImg from './table_item_img';
import TableItemText from './table_item_text';

import TableColumnModel from '../../models/table_column_model';


let TableItem = React.createClass({
    mixins: [TableColumnMixin],

    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnModel)),
        columnContent: React.PropTypes.object.isRequired
    },

    render() {
        
        /**
         * An element in the Table can have a certain display_type.
         * A display_type is just 
         */
        let calcColumnElementContent = () => {
            return this.props.columnList.map((column, i) => {

                let TypeElement = column.displayType;
                let columnClass = this.calcColumnClasses(this.props.columnList, i);

                return (
                    <div className={columnClass + ' ascribe-table-item-column'} key={i}>
                        <TypeElement content={this.props.columnContent[column.columnName]} width="50" />
                    </div>
                );

            });
        };

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-item">
                <div className="row">
                    {calcColumnElementContent()}
                </div>
            </div> 
        );
    }
});

export default TableItem;
