import React from 'react';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';

import PieceListBulkModalSelectedEditionsWidget from './piece_list_bulk_modal_selected_editions_widget';
import AclButtonList from '../ascribe_buttons/acl_button_list';


let PieceListBulkModal = React.createClass({
    propTypes: {
        className: React.PropTypes.string
    },

    getInitialState() {
        return EditionListStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
    },

    componentDidUnmount() {
        EditionListStore.unlisten(this.onChange);
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

    clearAllSelections() {
        EditionListActions.clearAllEditionSelections();
    },

    handleSuccess(){

    },

    render() {
        let availableAcls = this.getAvailableAcls();
        let selectedEditions = this.fetchSelectedEditionList();

        if(availableAcls.length > 0) {
            return (
                <div className={this.props.className}>
                    <div className="row no-margin">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 piece-list-bulk-modal">
                            <p></p>
                            <div className="row">
                                <div className="text-center">
                                    <PieceListBulkModalSelectedEditionsWidget
                                        numberOfSelectedEditions={this.fetchSelectedEditionList().length} />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span 
                                        className="piece-list-bulk-modal-clear-all"
                                        onClick={this.clearAllSelections}>clear all</span>
                                </div>
                            </div>
                            <p></p>
                            <div className="row">
                                <AclButtonList
                                    availableAcls={availableAcls}
                                    editions={selectedEditions}
                                    handleSuccess={this.handleSuccess} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        } 
        
    }
});

export default PieceListBulkModal;