'use strict';

import React from 'react';

import ApiUrls from '../../constants/api_urls';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';
import Button from 'react-bootstrap/lib/Button';

import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js';


let ShareForm = React.createClass({
    propTypes: {
        editions: React.PropTypes.array,
        currentUser: React.PropTypes.object
    },

    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join()
        };
    },
    handleSuccess(response){
        if ('handleSuccess' in this.props){
            this.props.handleSuccess(response);
        }
    },
    getBitcoinIds(){
        return this.props.editions.map(function(edition){
            return edition.bitcoin_id;
        });
    },

    getTitlesString(){
        return this.props.editions.map(function(edition){
            return '- \"' + edition.title + ', ' + getLangText('edition') + ' ' + edition.edition_number + '\"\n';
        });
    },

    render() {
        let title = this.getTitlesString().join('');
        let username = this.props.currentUser.username;
        let message =
`${getLangText('Hi')},

${getLangText('I am sharing')} :
${title}${getLangText('with you')}.

${getLangText('Truly yours')},
${username}`;
        return (
            <Form
                ref='form'
                url={ApiUrls.ownership_shares_editions}
                getFormData={this.getFormData}
                handleSuccess={this.handleSuccess}
                buttons={
                    <div className="modal-footer">
                        <p className="pull-right">
                            <Button
                                className="btn btn-default btn-sm ascribe-margin-1px"
                                type="submit">SHARE</Button>
                            <Button
                                className="btn btn-danger btn-delete btn-sm ascribe-margin-1px"
                                style={{marginLeft: '0'}}
                                onClick={this.props.onRequestHide}>CLOSE</Button>
                        </p>
                    </div>}
                spinner={
                    <div className="modal-footer">
                        <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_small.gif'} />
                    </div>
                }
                >
                <Property
                    name='share_emails'
                    label={getLangText('Emails')}>
                    <input
                        type="text"
                        placeholder={getLangText('Comma separated emails')}
                        required/>
                </Property>
                <Property
                    name='share_message'
                    label='Personal Message'
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        defaultValue={message}
                        placeholder={getLangText('Enter a message...')}
                        required="required"/>
                </Property>
            </Form>
        );
    }
});

export default ShareForm;