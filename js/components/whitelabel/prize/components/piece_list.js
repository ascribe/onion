'use strict';

import React from 'react';
import PieceList from '../../../piece_list';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import AccordionListItemPrize from './ascribe_accordion_list/accordion_list_item_prize';

let PrizePieceList = React.createClass({
    render() {
        return (
            <div>
                <PieceList
                    redirectTo="register_piece"
                    accordionListItemType={AccordionListItemPrize}
                    customSubmitButton={
                        <ButtonLink to="register_piece">
                            Submit to prize
                        </ButtonLink>
                    }/>
            </div>
        );
    }
});

export default PrizePieceList;
