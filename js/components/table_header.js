import React from 'react';

import TableColumnMixin from '../mixins/table_column_mixin';
import GeneralUtils from '../utils/general_utils';


let TableHeader = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnMap: React.PropTypes.object.isRequired,
        itemList: React.PropTypes.array.isRequired,
        fetchList: React.PropTypes.func.isRequired
    },

    sortIndex(i) {
        this.props.fetchList(1, 10, null, '-' + Object.keys(this.props.columnMap)[i]);
    },

    render() {

        let columnMapValuesList = GeneralUtils.valuesOfObject(this.props.columnMap);

        let calcHeaderText = (val, i, columnClass) => {
            let s = "";

            if(columnMapValuesList[i].canBeOrdered) {

                let boundClick = this.sortIndex.bind(this, i)
                return (
                    <div className={columnClass + ' ascribe-table-header-column'} key={i} onClick={boundClick}>
                        <span>
                            <span className="glyphicon glyphicon-chevron-down"></span>
                            {val.displayName}
                        </span>
                    </div>
                );
            } else {
                return (
                    <div className={columnClass + ' ascribe-table-header-column'} key={i}>
                        <span>
                            {val.displayName}
                        </span>
                    </div>
                );
            }
        };

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-header-row">
                <div className="row">
                    {columnMapValuesList.map((val, i) => {

                        let columnClass = this.calcColumnClasses(this.props.columnMap, i);

                        return (
                            <div key={i}>
                                {calcHeaderText(val, i, columnClass)}
                            </div>
                        );
                    })}
                </div>
            </div> 
        );

    }
});

export default TableHeader;
