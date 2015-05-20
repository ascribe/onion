import React from 'react';

import TableColumnMixin from '../mixins/table_column_mixin';
import GeneralUtils from '../utils/general_utils';

let TableHeader = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnMap: React.PropTypes.object.isRequired
    },

    render() {

        let columnMapValuesList = GeneralUtils.valuesOfObject(this.props.columnMap);
        let columnClasses = this.calcColumnClasses(this.props.columnMap);

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                    {columnMapValuesList.map((val, i) => {
                        return (
                            <div className={columnClasses} key={i}>
                                {val}
                            </div>
                        );
                    })}
                </div>
            </div> 
        );

    }
});

export default TableHeader;