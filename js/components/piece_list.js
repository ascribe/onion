import React from 'react';
import Router from 'react-router';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import Table from './table';
import TableItemImg from './table_item_img';
import TableItemText from './table_item_text';
import Pagination from './pagination'

let Link = Router.Link;


let PieceList = React.createClass({
    
    // FIXME: this might be useless
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        let page = this.props.query.page || this.state.page;
        PieceListActions.fetchList(page, this.state.pageSize, this.state.search,
                                   this.state.orderBy, this.state.orderAsc);
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
                <Pagination currentPage={this.props.query.page} />
            </AltContainer>
        );
    }
});

export default PieceList;
