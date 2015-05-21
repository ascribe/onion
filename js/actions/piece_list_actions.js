import alt from '../alt';
import PieceListFetcher from '../fetchers/piece_list_fetcher';


class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList'
        );
    }

    fetchList(page, pageSize, search, orderBy, orderAsc) {
        PieceListFetcher.fetch(page, pageSize, search, orderBy, orderAsc)
            .then((res) => {
                this.actions.updatePieceList({
                    'itemList': res.pieces, 
                    'orderBy': orderBy,
                    'orderAsc': orderAsc
                });
            })
            .catch((err) => {
                console.log(err);           
            });
    }
};

export default alt.createActions(PieceListActions);
