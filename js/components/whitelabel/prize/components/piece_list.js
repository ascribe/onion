'use strict';

import React from 'react';
import PieceList from '../../../piece_list';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';


let PrizePieceList = React.createClass({
    render() {
        return (
            <div>
                <ButtonLink to="register_piece">
                    Submit a new artwork to the prize
                </ButtonLink>

                <PieceList redirectTo="register_piece" />
            </div>
        );
    }
});

export default PrizePieceList;
