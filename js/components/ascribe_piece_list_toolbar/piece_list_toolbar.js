import React from 'react';

import EditionListStore from '../../stores/edition_list_store';

let PieceListToolbar = React.createClass({
    getInitialState() {
        return EditionListStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange)
    },

    componentDidUnmount() {
        EditionListStore.unlisten(this.onChange)
    },

    filterForSelected(edition) {
        return edition.selected;
    },

    fetchSelectedEditionList() {
        let selectedEditionList = [];

        Object
            .keys(this.state.editionList)
            .forEach((key) => {
                let filteredEditionsForPiece = this.state.editionList[key]
                    .filter(this.filterForSelected);
                selectedEditionList = selectedEditionList.concat(filteredEditionsForPiece);
            });

        return selectedEditionList;
    },

    intersectAcls(a, b) {
        //console.log(a, b);
        return a.filter((val) => b.indexOf(val) > -1);
    },

    getAvailableAcls() {
        let availableAcls = [];
        let selectedEditionList = this.fetchSelectedEditionList();

        // If no edition has been selected, availableActions is empty
        // If only one edition has been selected, their actions are available
        if(selectedEditionList.length >= 1) {
            availableAcls = selectedEditionList[0].acl;
        }
        if(selectedEditionList.length >= 2) {
            for(let i = 1; i < selectedEditionList.length; i++) {
                availableAcls = this.intersectAcls(availableAcls, selectedEditionList[i].acl);
            }
        }
        
        return availableAcls;
    },

    render() {
        this.getAvailableAcls();

        return (
            <div className="row no-margin">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 piece-list-toolbar">
                    <div className="pull-right">
                        <button type="button" className="btn btn-default btn-sm">Transfer</button>
                        <button type="button" className="btn btn-default btn-sm">Consign</button>
                        <button type="button" className="btn btn-default btn-sm">Share</button>
                        <button type="button" className="btn btn-default btn-sm">Loan</button>
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;