import React from 'react';

import TableItem from './table_item';

let Table = React.createClass({
    render() {
        return (
            <ul>
                {this.props.pieceList.map((piece, i) => {
                    return (
                        <li key={i}>
                            <TableItem piece={piece} />
                        </li> 
                    );
                })}
                
                }
            </ul>
        );
    }
});

export default Table;