'use strict';

import React from 'react';
import Router from 'react-router';

import Button from 'react-bootstrap/lib/Button';

import EditionDeleteForm from '../ascribe_forms/form_delete_edition';
import PieceDeleteForm from '../ascribe_forms/form_delete_piece';

import EditionRemoveFromCollectionForm from '../ascribe_forms/form_remove_editions_from_collection';
import PieceRemoveFromCollectionForm from '../ascribe_forms/form_remove_piece_from_collection';

import ModalWrapper from '../ascribe_modal/modal_wrapper';

import { getAvailableAcls } from '../../utils/acl_utils';
import { getLangText } from '../../utils/lang_utils.js';


let DeleteButton = React.createClass({
    propTypes: {
        editions: React.PropTypes.array,
        piece: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    mixins: [Router.Navigation],

    render: function () {
        let availableAcls;
        let btnDelete;
        let content;
        let title;

        if(this.props.piece && !this.props.editions) {
            availableAcls = getAvailableAcls([this.props.piece]);
        } else {
            availableAcls = getAvailableAcls(this.props.editions);
        }

        if(availableAcls.acl_delete) {

            if(this.props.piece && !this.props.editions) {
                content = <PieceDeleteForm pieceId={this.props.piece.id}/>;
                title = getLangText('Remove Piece');
            } else {
                content = <EditionDeleteForm editions={this.props.editions}/>;
                title = getLangText('Remove Edition');
            }

            btnDelete = <Button bsStyle="danger" className="btn-delete" bsSize="small">{getLangText('DELETE')}</Button>;
        
        } else if(availableAcls.acl_unshare){
            
            if(this.props.editions && this.props.editions.constructor !== Array && this.props.editions.acl.acl_unshare) {
                content = <EditionRemoveFromCollectionForm editions={this.props.editions}/>;
                title = getLangText('Remove Edition from Collection');
            } else {
                content = <PieceRemoveFromCollectionForm pieceId={this.props.piece.id}/>;
                title = getLangText('Remove Piece from Collection');
            }

            btnDelete = <Button bsStyle="danger" className="btn-delete" bsSize="small">{getLangText('REMOVE FROM COLLECTION')}</Button>;
        }
        else {
            return null;
        }
        return (
            <ModalWrapper
                button={btnDelete}
                handleSuccess={this.props.handleSuccess}
                title={title}>
                {content}
            </ModalWrapper>
        );
    }
});

export default DeleteButton;

