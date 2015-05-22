import alt from '../alt';
import PieceListActions from '../actions/piece_list_actions';


class PieceListStore {
    constructor() {
        this.pieceList = []; // rename this to pieceList after figuring out AltContainer transform
        this.page = 1;
        this.pageSize = 10;
        this.search = "";
        this.orderBy = "artist_name";
        this.orderAsc = true;
        this.bindActions(PieceListActions);
    }

    onUpdatePieceList({ page, pageSize, search, pieceList, orderBy, orderAsc }) {
        this.page = page;
        this.pageSize = pageSize;
        this.search = search;
        this.orderAsc = orderAsc;
        this.orderBy = orderBy;
        this.pieceList = pieceList;
    }
};

export default alt.createStore(PieceListStore);
