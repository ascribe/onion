'use strict';

import React from 'react';
import PieceList from '../../../piece_list';


let PrizePieceList = React.createClass({
    render() {
        return (
            <PieceList redirectTo="register_piece" />
        );
    }
});

export default PrizePieceList;
