import alt from '../alt';
import PieceListFetcher from '../fetchers/piece_list_fetcher';


class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList'
        );
    }

    fetchList(page, pageSize, search, ordering) {
        PieceListFetcher.fetch(page, pageSize, search, ordering)
            .then((res) => {
                this.actions.updatePieceList(res.pieces);
            })
            .catch((err) => {
                console.log(err);           
            });
    }
};

export default alt.createActions(PieceListActions);
