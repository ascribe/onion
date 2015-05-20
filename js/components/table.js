import React from 'react';

import TableItem from './table_item';

let Table = React.createClass({
    render() {
        return (
            <div className="row as-pieces-table">
                {this.props.pieceList.map((piece, i) => {
                    return (
                        <TableItem piece={piece} key={i}/>
                    );
                })}
            </div>
        );
    }
});

export default Table;