'use strict';

import React from 'react';

import EditionListActions from '../../actions/edition_list_actions';
import EditionListStore from '../../stores/edition_list_store';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItemEditionWidget = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
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
        return (
            <span
                onClick={this.toggleTable}
                className="ascribe-accordion-list-item-edition-widget pull-right">
                 {this.getGlyphicon()} {this.props.piece.num_editions + ' ' + getLangText('Editions')}
            </span>
        );
    }
});

export default AccordionListItemEditionWidget;