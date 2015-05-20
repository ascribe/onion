import React from 'react';
import Router from 'react-router';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';
import Table from './table';

let Link = Router.Link;

let PieceList = React.createClass({
    
    componentDidMount() {
        PieceListActions.fetchPieceList();
    },

    render() {
        return (
            <AltContainer store={PieceListStore}>
                <Table />
            </AltContainer>
        );
    }
});

export default PieceList;
