import React from 'react';

import TableColumnMixin from '../mixins/table_column_mixin';
import GeneralUtils from '../utils/general_utils';


let TableHeader = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnMap: React.PropTypes.object.isRequired,
        itemList: React.PropTypes.array.isRequired,
        fetchList: React.PropTypes.func.isRequired,
        orderAsc: React.PropTypes.bool.isRequired,
        orderBy: React.PropTypes.string.isRequired
    },

    sortIndex(i) {

        let orderAsc;

        if(this.props.orderAsc) {
            orderAsc = false;
        } else {
            orderAsc = true;
        }

        this.props.fetchList(1, 10, null, Object.keys(this.props.columnMap)[i], orderAsc);
    },

    render() {

        let columnMapValuesList = GeneralUtils.valuesOfObject(this.props.columnMap);

        let calcHeaderText = (val, i, columnClass) => {

            if(columnMapValuesList[i].canBeOrdered && Object.keys(this.props.columnMap)[i] === this.props.orderBy) {

                let boundClick = this.sortIndex.bind(this, i);
                let carretDirection = 'glyphicon-triangle-';

                if(this.props.orderAsc) {
                    carretDirection += 'top';
                } else {
                    carretDirection += 'bottom';
                }

                return (
                    <div className={columnClass + ' ascribe-table-header-column'} key={i} onClick={boundClick}>
                        <span>
                            {val.displayName}
                            <span className={'glyphicon ' + carretDirection}></span>
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
