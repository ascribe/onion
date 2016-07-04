'use strict';

import React from 'react';

import Form from './form';

import AscribeSpinner from '../ascribe_spinner';

import { getLangText } from '../../utils/lang';
import { formatText } from '../../utils/text';
import { resolveUrl } from '../../utils/url_resolver';

let EditionRemoveFromCollectionForm = React.createClass({
    propTypes: {
        editions: React.PropTypes.arrayOf(React.PropTypes.object),

        // Propagated by ModalWrapper in most cases
        handleSuccess: React.PropTypes.func
    },

    getBitcoinIds() {
        return this.props.editions.map((edition) => edition.bitcoin_id);
    },

    getUrl() {
        return formatText(resolveUrl('edition_remove_from_collection'), {
            // Since this form can be used for either deleting a single edition or multiple we need
            // to call getBitcoinIds to get the value of edition_id
            editionId: this.getBitcoinIds().join(',')
        });
    },

    render() {
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
                <p>{getLangText('Are you sure you would like to remove these editions from your collection')}&#63;</p>
                <p>{getLangText('This is an irrevocable action%s', '.')}</p>
            </Form>
        );
    }
});


export default EditionRemoveFromCollectionForm;
