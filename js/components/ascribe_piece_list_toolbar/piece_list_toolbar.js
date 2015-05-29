import React from 'react';

import EditionListStore from '../../stores/edition_list_store';

import AclButton from '../acl_button';
import PieceListToolbarSelectedEditionsWidget from './piece_list_toolbar_selected_editions_widget';

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
                let filteredEditionsForPiece = this.state.editionList[key].filter(this.filterForSelected);
                selectedEditionList = selectedEditionList.concat(filteredEditionsForPiece);
            });

        return selectedEditionList;
    },

    intersectAcls(a, b) {
        return a.filter((val) => b.indexOf(val) > -1);
    },

    bulk(action) {
        console.log(action);
    },

    getAvailableAcls() {
        let availableAcls = [];
        let selectedEditionList = this.fetchSelectedEditionList();

        // If no edition has been selected, availableActions is empty
        // If only one edition has been selected, their actions are available
        // If more than one editions have been selected, their acl properties are intersected
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
        let availableAcls = this.getAvailableAcls();

        return (
            <div className="row no-margin">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 piece-list-toolbar">
                    <div className="pull-left">
                        <PieceListToolbarSelectedEditionsWidget
                            numberOfSelectedEditions={this.fetchSelectedEditionList().length} />
                    </div>
                    <div className="pull-right">
                        <AclButton availableAcls={availableAcls} action="transfer" actionFunction={this.bulk} />
                        <AclButton availableAcls={availableAcls} action="consign" actionFunction={this.bulk} />
                        <AclButton availableAcls={availableAcls} action="share" actionFunction={this.bulk} />
                        <AclButton availableAcls={availableAcls} action="loan" actionFunction={this.bulk} />
                    </div>
                </div>
            </div>
        );
    }
});

export default PieceListToolbar;