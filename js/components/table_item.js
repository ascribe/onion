import React from 'react';

import TableColumnMixin from '../mixins/table_column_mixin';

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

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                    {columnMapKeysList.map((key, i) => {
                        return (
                            <div className={columnClasses} key={i}>
                                {columnContent[key]}
                            </div>
                        );
                    })}
                </div>
            </div> 
        );
    }
});

export default TableItem;