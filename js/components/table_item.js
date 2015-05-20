import React from 'react';

import TableColumnMixin from '../mixins/table_column_mixin';
import TableItemImg from './table_item_img';
import TableItemText from './table_item_text';

let TableItem = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnMap: React.PropTypes.object.isRequired,
        columnContent: React.PropTypes.object.isRequired
    },
    render() {
        
        let columnContent = this.props.columnContent;
        let columnClasses = this.calcColumnClasses(this.props.columnMap);
        let columnMapKeysList = Object.keys(this.props.columnMap);

        /**
         * An element in the Table can have a certain display_type.
         * For example it can be an Image or a text, or a button.
         * This method is recognizing different types and injecting them into the DOM.
         */
        let calcColumnElementContent = () => {
            return columnMapKeysList.map((key, i) => {
                if(this.props.columnMap[key].display_type === TableItemImg) {
                    return (
                        <div className={columnClasses}>
                            <TableItemImg src={this.props.columnContent[key]} width="50" key={i} />
                        </div>
                    );
                } else if(this.props.columnMap[key].display_type === TableItemText) {
                    return (
                        <div className={columnClasses}>
                            <TableItemText text={this.props.columnContent[key]} key={i} />
                        </div>
                    );
                }
            });
        };

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                    {calcColumnElementContent()}
                </div>
            </div> 
        );
    }
});

export default TableItem;