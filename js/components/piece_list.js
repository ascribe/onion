import React from 'react';
import Router from 'react-router';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import Table from './ascribe_table/table';
import TableItemImg from './ascribe_table/table_item_img';
import TableItemText from './ascribe_table/table_item_text';

let Link = Router.Link;


let PieceList = React.createClass({
    
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListActions.fetchList(this.state.page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);
    },

    render() {

        // TODO:
        // Specifiy how a TableItemX should look like
        let columnMap = {
            'thumbnail': {
                'displayName': '',
                'displayType': TableItemImg,
                'rowWidth': 2,
                'canBeOrdered': false
            },
            'artist_name': {
                'displayName': 'Artist',
                'displayType': TableItemText,
                'rowWidth': 4,
                'canBeOrdered': true
            },
            'title': {
                'displayName': 'Title',
                'displayType': TableItemText,
                'rowWidth': 4,
                'canBeOrdered': true
            }
        };

        return (
            <AltContainer store={PieceListStore} actions={PieceListActions}>
                <Table columnMap={columnMap} />
            </AltContainer>
        );
    }
});

export default PieceList;
