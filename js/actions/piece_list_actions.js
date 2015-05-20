import alt from '../alt';
import PieceListFetcher from '../fetchers/piece_list_fetcher';


class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList'
        );
    }

    fetchPieceList() {
        PieceListFetcher.fetch(1, 10)
            .then((res) => {
                this.actions.updatePieceList(res.pieces);
            })
            .catch((err) => {
                console.log(err);           
            });
    }
};

export default alt.createActions(PieceListActions);
