import React from 'react';
import Router from 'react-router';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import Table from './table';
import TableItemImg from './table_item_img';
import TableItemText from './table_item_text';

let Link = Router.Link;

let PieceList = React.createClass({
    
    componentDidMount() {
        PieceListActions.fetchPieceList();
    },

    render() {

        let columnMap = {
            'thumbnail': {
                'display_name': 'thumbnail',
                'display_type': TableItemImg
            },
            'artist_name': {
                'display_name': 'Artist',
                'display_type': TableItemText
            },
            'title': {
                'display_name': 'Title',
                'display_type': TableItemText
            }
        };

        return (
            <AltContainer store={PieceListStore}>
                <Table class="piecesTable" columnMap={columnMap} />
            </AltContainer>
        );
    }
});

export default PieceList;
