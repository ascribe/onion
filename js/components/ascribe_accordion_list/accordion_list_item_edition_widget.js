'use strict';

import React from 'react';

import EditionListActions from '../../actions/edition_list_actions';
import EditionListStore from '../../stores/edition_list_store';

import { getLangText } from '../../utils/lang_utils';

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
            if(typeof this.state.editionList[pieceId] === 'undefined') {
                return (
                    <span className="glyph-ascribe-spool-chunked ascribe-color spin"/>
                );
            } else {
                return (
                    <span className="glyphicon glyphicon-menu-up" aria-hidden="true" style={{top: 2}}></span>
                );
            }
            
        } else {
            return (
                <span className="glyphicon glyphicon-menu-down" aria-hidden="true" style={{top: 2}}></span>
            );
        }
    },

    render() {
        let piece = this.props.piece;
        let numEditions = piece.num_editions;

        if(numEditions === 0) {
            return (
                <span
                    onClick={this.toggleTable}
                    className="ascribe-accordion-list-item-edition-widget">
                    + Editions
                </span>
            );
        } else if(numEditions === 1) {
            let editionMapping = piece && piece.firstEdition ? piece.firstEdition.edition_number + '/' + piece.num_editions : '';

            return (
                <span
                    onClick={this.toggleTable}
                    className="ascribe-accordion-list-item-edition-widget">
                    {editionMapping + ' ' + getLangText('Edition')} {this.getGlyphicon()}
                </span>
            );
        }
        else {
            return (
                <span
                    onClick={this.toggleTable}
                    className="ascribe-accordion-list-item-edition-widget">
                    {numEditions + ' ' + getLangText('Editions')} {this.getGlyphicon()}
                </span>
            );
        }
    }
});

export default AccordionListItemEditionWidget;