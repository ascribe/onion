'use strict';

import React from 'react';


import ListRequestActions from '../../../../ascribe_forms/list_form_request_actions';
import AclButtonList from '../../../../ascribe_buttons/acl_button_list';
import DeleteButton from '../../../../ascribe_buttons/delete_button';

import AclProxy from '../../../../acl_proxy';


import { mergeOptions } from '../../../../../utils/general_utils';


let WalletActionPanel = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        loadPiece: React.PropTypes.func.isRequired,
        submitButtonType: React.PropTypes.func.isRequired
    },

    render(){
        if (this.props.piece &&
            this.props.piece.notifications &&
            this.props.piece.notifications.length > 0) {
            return (
                <ListRequestActions
                    pieceOrEditions={this.props.piece}
                    currentUser={this.props.currentUser}
                    handleSuccess={this.props.loadPiece}
                    notifications={this.props.piece.notifications}/>);
        }
        else {

            //We need to disable the normal acl_loan because we're inserting a custom acl_loan button
            let availableAcls;

            if (this.props.piece && this.props.piece.acl && typeof this.props.piece.acl.acl_loan !== 'undefined') {
                // make a copy to not have side effects
                availableAcls = mergeOptions({}, this.props.piece.acl);
                availableAcls.acl_loan = false;
            }
            let SubmitButtonType = this.props.submitButtonType;

            return (
                <AclButtonList
                    className="text-center ascribe-button-list"
                    availableAcls={availableAcls}
                    editions={this.props.piece}
                    handleSuccess={this.loadPiece}>
                    <AclProxy
                        aclObject={this.props.currentUser.acl}
                        aclName="acl_wallet_submit">
                        <AclProxy
                            aclObject={availableAcls}
                            aclName="acl_wallet_submit">
                            <SubmitButtonType
                                className="btn-sm"
                                handleSuccess={this.handleSubmitSuccess}
                                piece={this.props.piece}/>
                        </AclProxy>
                    </AclProxy>
                    <DeleteButton
                        handleSuccess={this.handleDeleteSuccess}
                        piece={this.props.piece}/>
                </AclButtonList>
            );
        }
    }
});

export default WalletActionPanel;