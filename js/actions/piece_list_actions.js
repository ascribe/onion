import alt from '../alt';

import PieceListFetcher from '../fetchers/piece_list_fetcher';


class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList'
        );
    }

    fetchPieceList(page, pageSize, search, orderBy, orderAsc) {
        PieceListFetcher
            .fetch(page, pageSize, search, orderBy, orderAsc)
            .then((res) => {
                this.actions.updatePieceList({
                    page,
                    pageSize,
                    search,
                    orderBy,
                    orderAsc,
                    'pieceList': res.pieces
                });
            })
            .catch((err) => {
                console.log(err);           
            });
    }

};

export default alt.createActions(PieceListActions);
