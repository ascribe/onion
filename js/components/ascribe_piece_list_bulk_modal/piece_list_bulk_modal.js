'use strict';

import React from 'react';

import EditionListActions from '../../actions/edition_list_actions';

import PieceListBulkModalSelectedEditionsWidget from './piece_list_bulk_modal_selected_editions_widget';

import { getLangText } from '../../utils/lang.js';


let PieceListBulkModal = React.createClass({
    propTypes: {
        availableAcls: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        selectedEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    clearAllSelections() {
        EditionListActions.clearAllEditionSelections();
        EditionListActions.closeAllEditionLists();
    },

    render() {
        if (Object.keys(this.props.availableAcls).length) {
            return (
                <div className={this.props.className}>
                    <div className="row no-margin">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 piece-list-bulk-modal">
                            <p></p>
                            <div className="row">
                                <div className="text-center">
                                    <PieceListBulkModalSelectedEditionsWidget
                                        numberOfSelectedEditions={this.props.selectedEditions.length} />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span
                                        className="piece-list-bulk-modal-clear-all"
                                        onClick={this.clearAllSelections}>{getLangText('clear all')}</span>
                                </div>
                            </div>
                            <p></p>
                            <div className="row-fluid">
                                {this.props.children}
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
