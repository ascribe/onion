import React from 'react';
import Router from 'react-router';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

let Link = Router.Link;

var PieceList = React.createClass({
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        PieceListActions.fetchPieceList();
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        return (
            <ul>
                {this.state.pieceList.map((piece, i) => {
                    return (
                        <li key={i}><Link to="piece" params={{'bitcoin_ID_noPrefix': piece.bitcoin_ID_noPrefix}}>{piece.title}</Link></li>
                    );
                })}
            </ul>
        );
    }
});

export default PieceList;
