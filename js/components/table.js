import React from 'react';

import TableItem from './table_item';
import TableHeader from './table_header';

let Table = React.createClass({
    propTypes: {
        columnMap: React.PropTypes.object.isRequired
    },
    render() {

        if(this.props.itemList && this.props.itemList.length > 0) {

            return (
                <div className="ascribe-table">
                    <TableHeader columnMap={this.props.columnMap}/>
                    {this.props.itemList.map((item, i) => {
                        return (
                            <TableItem columnMap={this.props.columnMap} columnContent={item} key={i} />
                        );
                    })}
                </div>
            );

        } else {
            return (
                <p>Loading</p>
            );
        }
    }
});

export default Table;
