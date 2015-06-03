import alt from '../alt';
import PieceListActions from '../actions/piece_list_actions';


class PieceListStore {
    constructor() {
        /**
         * The store manages the state that is introduced by fetching 
         * the resource with certain parameters.
         *
         * This means that pieceList for example only contains pageSize-many items.
         * Of course this can be altered by page as well.
         *
         * This is also the reason why we store a pieceListCount, which is essentially
         * the number of items the resource actually - without pagination - provides.
         */
        this.pieceList = [];
        this.pieceListCount = 0;
        this.page = 1;
        this.pageSize = 10;
        this.search = "";
        this.orderBy = "artist_name";
        this.orderAsc = true;
        this.bindActions(PieceListActions);
    }

    onShowEditionList(pieceId) {
        this.pieceList
            .forEach((piece) => {
                if(piece.id === pieceId) {
                    if(piece.show) {
                        piece.show = false;
                    } else {
                        piece.show = true;
                    }
                }
            });
    }

    onUpdatePieceList({ page, pageSize, search, pieceList, orderBy, orderAsc, pieceListCount }) {
        this.page = page;
        this.pageSize = pageSize;
        this.search = search;
        this.orderAsc = orderAsc;
        this.orderBy = orderBy;
        this.pieceList = pieceList;
        this.pieceListCount = pieceListCount;
    }
};

export default alt.createStore(PieceListStore);
