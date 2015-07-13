'use strict';

import React from 'react';
import classNames from 'classnames';

import EditionListActions from '../../actions/edition_list_actions';
import EditionListStore from '../../stores/edition_list_store';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItemEditionWidget = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        piece: React.PropTypes.object.isRequired,
        toggleCreateEditionsDialog: React.PropTypes.func.isRequired
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
                    <span className="glyph-ascribe-spool-chunked spin"/>
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

        if(numEditions === -1) {
            return (
                <button
                    onClick={this.props.toggleCreateEditionsDialog}
                    className={classNames('btn', 'btn-default', 'btn-xs', 'ascribe-accordion-list-item-edition-widget', this.props.className)}>
                    + Editions
                </button>
            );
        }
        else if(numEditions === 0) {
            return (
                    <button disabled className={classNames('btn', 'btn-default', 'btn-xs', this.props.className)}>
                        Creating Editions <span className="glyph-ascribe-spool-chunked spin"/>
                    </button>
                );
        }
        else if(numEditions === 1) {
            let editionMapping = piece && piece.firstEdition ? piece.firstEdition.edition_number + '/' + piece.num_editions : '';

            return (
                <button
                    onClick={this.toggleTable}
                    className={classNames('btn', 'btn-default', 'btn-xs', 'ascribe-accordion-list-item-edition-widget', this.props.className)}>
                    {editionMapping + ' ' + getLangText('Edition')} {this.getGlyphicon()}
                </button>
            );
        }
        else {
            return (
                <button
                    onClick={this.toggleTable}
                    className={classNames('btn', 'btn-default', 'btn-xs', 'ascribe-accordion-list-item-edition-widget', this.props.className)}>
                    {numEditions + ' ' + getLangText('Editions')} {this.getGlyphicon()}
                </button>
            );
        }
    }
});

export default AccordionListItemEditionWidget;