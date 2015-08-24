'use strict';

import React from 'react';
import Router from 'react-router';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import ContractForm from './ascribe_forms/ikonotv_contract_form';
import RegisterPieceForm from '../../../../../components/ascribe_forms/form_register_piece';
import Property from '../../../../../components/ascribe_forms/property';
import InputCheckbox from '../../../../../components/ascribe_forms/input_checkbox';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';


let IkonotvRegisterPiece = React.createClass({

    mixins: [Router.Navigation],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState());
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },


    render() {
        if (this.state.currentUser &&
            this.state.whitelabel &&
            this.state.whitelabel.user &&
            this.state.currentUser.email === this.state.whitelabel.user){
            return (
                <ContractForm />
            );
        }
        return (
            <div className="ascribe-form-bordered ascribe-form-wrapper">
                <RegisterPieceForm
                    enableLocalHashing={false}
                    headerMessage={getLangText('Register your work')}
                    submitMessage={getLangText('Register')}
                    handleSuccess={this.handleRegisterSuccess}/>
            </div>
        );

    }
});


export default IkonotvRegisterPiece;
