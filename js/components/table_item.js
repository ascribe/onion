import React from 'react';

import TableColumnMixin from '../mixins/table_column_mixin';
import TableItemImg from './table_item_img';
import TableItemText from './table_item_text';


let TableItem = React.createClass({
    mixins: [TableColumnMixin],

    // ToDo: Specify that every columnMap should look like this:
    // {
    //      'name-of-the-data-point': {
    //          'displayName': String,
    //          'displayType': ReactComponent,
    //          'rowWidth': number
    //      }
    // 
    // }
    propTypes: {
        columnMap: React.PropTypes.object.isRequired,
        columnContent: React.PropTypes.object.isRequired
    },
    render() {
        
        let columnContent = this.props.columnContent;
        let columnMapKeysList = Object.keys(this.props.columnMap);

        /**
         * An element in the Table can have a certain display_type.
         * A display_type is just 
         */
        let calcColumnElementContent = () => {
            return columnMapKeysList.map((key, i) => {

                let TypeElement = this.props.columnMap[key].displayType;
                let columnClass = this.calcColumnClasses(this.props.columnMap, i);

                return (
                    <div className={columnClass} key={i}>
                        <TypeElement content={this.props.columnContent[key]} width="50" />
                    </div>
                );

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
