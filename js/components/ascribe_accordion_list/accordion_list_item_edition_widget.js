'use strict';

import React from 'react';
import classNames from 'classnames';

import EditionListActions from '../../actions/edition_list_actions';
import EditionListStore from '../../stores/edition_list_store';

import CreateEditionsButton from '../ascribe_buttons/create_editions_button';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItemEditionWidget = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        piece: React.PropTypes.object.isRequired,
        toggleCreateEditionsDialog: React.PropTypes.func.isRequired,
        onPollingSuccess: React.PropTypes.func
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
            // this is the loading feedback for the editions
            // button.
            // 
            // PLEASE FUTURE TIM, DO NOT FUCKING REMOVE IT AGAIN!
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

        if(numEditions <= 0) {
            if (piece.acl.acl_editions){
                return (
                    <CreateEditionsButton
                        label={getLangText('Create editions')}
                        className="btn-xs pull-right"
                        piece={piece}
                        toggleCreateEditionsDialog={this.props.toggleCreateEditionsDialog}
                        onPollingSuccess={this.props.onPollingSuccess}/>
                );
            }
            else {
                return null;
            }

        } else {
            let editionMapping = piece && piece.first_edition ? piece.first_edition.num_editions_available + '/' + piece.num_editions : '';

            return (
                <button
                    onClick={this.toggleTable}
                    className={classNames('btn', 'btn-default', 'btn-xs', 'ascribe-accordion-list-item-edition-widget', this.props.className)}>
                    {editionMapping + ' ' + getLangText('Editions')} {this.getGlyphicon()}
                </button>
            );
        }
    }
});

export default AccordionListItemEditionWidget;