'use strict';

import React from 'react';

import EditionListActions from '../../actions/edition_list_actions';
import EditionListStore from '../../stores/edition_list_store';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';

let AccordionListItemEditionWidget = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return EditionListStore.getState();
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        EditionListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    /**
     * Calls the store to either show or hide the editionListTable
     */
    toggleTable() {
        let pieceId = this.props.piece.id;
        let isEditionListOpen = this.state.isEditionListOpenForPieceId[pieceId] ? this.state.isEditionListOpenForPieceId[pieceId].show : false;
        
        if(isEditionListOpen) {
            EditionListActions.toggleEditionList(pieceId);
        } else {
            EditionListActions.toggleEditionList(pieceId);
            EditionListActions.fetchEditionList(pieceId);
        }
    },

    /**
     * Depending on the state of isEditionListOpenForPieceId we either want to display
     * a glyphicon arrow pointing upwards or downwards
     */
    getGlyphicon() {
        let pieceId = this.props.piece.id;
        let isEditionListOpen = this.state.isEditionListOpenForPieceId[pieceId] ? this.state.isEditionListOpenForPieceId[pieceId].show : false;
        
        if(isEditionListOpen) {
            return (
                <span className="glyphicon glyphicon-menu-up" aria-hidden="true" style={{top: 2}}></span>
            );
        } else {
            return (
                <span className="glyphicon glyphicon-menu-down" aria-hidden="true" style={{top: 2}}></span>
            );
        }
    },

    render() {
        let piece = this.props.piece;
        let numEditions = piece.num_editions;

        if(numEditions === 1) {
            let firstEditionId = piece && piece.firstEdition ? ', ' + piece.firstEdition.bitcoin_id : '';
            let editionMapping = piece && piece.firstEdition ? piece.firstEdition.edition_number + '/' + piece.num_editions : '';

            return (
                <span
                    onClick={this.toggleTable}
                    className="ascribe-accordion-list-item-edition-widget pull-right">
                     {this.getGlyphicon()} {editionMapping + ' ' + getLangText('Edition') + firstEditionId}
                </span>
            );
        } else {
            return (
                <span
                    onClick={this.toggleTable}
                    className="ascribe-accordion-list-item-edition-widget pull-right">
                     {this.getGlyphicon()} {numEditions + ' ' + getLangText('Editions')}
                </span>
            );
        }
    }
});

export default AccordionListItemEditionWidget;