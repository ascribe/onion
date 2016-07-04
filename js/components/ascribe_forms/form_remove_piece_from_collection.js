'use strict';

import React from 'react';

import Form from './form';

import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang';
import { resolveUrl } from '../../utils/url_resolver';


let PieceRemoveFromCollectionForm = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,

        // Propagated by ModalWrapper in most cases
        handleSuccess: React.PropTypes.func
    },

    getUrl() {
        return formatText(resolveUrl('piece_remove_from_collection'), {
            pieceId: this.props.pieceId
        });
    },

    render () {
        return (
            <Form
                ref='form'
                url={this.getUrl()}
                method="delete"
                handleSuccess={this.props.handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <button
                                type="submit"
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                onClick={this.submit}>
                                {getLangText('YES, REMOVE')}
                            </button>
                        </p>
                    </div>
                }
                spinner={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <AscribeSpinner color='dark-blue' size='md'/>
                        </p>
                    </div>
                }>
                <p>{getLangText('Are you sure you would like to remove this piece from your collection')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default PieceRemoveFromCollectionForm;
