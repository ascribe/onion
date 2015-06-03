import alt from '../alt';
import PieceFetcher from '../fetchers/piece_fetcher';


class PieceActions {
    constructor() {
        this.generateActions(
            'updatePiece'
        );
    }

    fetchOne(pieceId) {
        PieceFetcher.fetchOne(pieceId)
            .then((res) => {
                this.actions.updatePiece(res.piece);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default alt.createActions(PieceActions);
