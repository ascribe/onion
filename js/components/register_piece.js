'use strict';

import React from 'react';
import { History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import UserStore from '../stores/user_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import PropertyCollapsible from './ascribe_forms/property_collapsible';
import RegisterPieceForm from './ascribe_forms/form_register_piece';

import LoginContainer from './login_container';
import SlidesContainer from './ascribe_slides_container/slides_container';


import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';


let RegisterPiece = React.createClass( {

    propTypes: {
        headerMessage: React.PropTypes.string,
        submitMessage: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
            React.PropTypes.string
        ]),
        location: React.PropTypes.object
    },

    mixins: [History],

    getDefaultProps() {
        return {
            canSpecifyEditions: true
        };
    },

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState(),
            PieceListStore.getState(),
            {
                selectedLicense: 0,
                isFineUploaderActive: false
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        if(this.state.currentUser && this.state.currentUser.email) {
            // we should also make the fineuploader component editable again
            this.setState({
                isFineUploaderActive: true
            });
        }
    },

    handleSuccess(response){
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // once the user was able to register a piece successfully, we need to make sure to keep
        // the piece list up to date
        PieceListActions.fetchPieceList(
            this.state.page,
            this.state.pageSize,
            this.state.searchTerm,
            this.state.orderBy,
            this.state.orderAsc,
            this.state.filterBy
        );

        this.history.pushState(null, `/pieces/${response.piece.id}`);
    },

    getSpecifyEditions() {
        if(this.state.whitelabel && this.state.whitelabel.acl_create_editions || Object.keys(this.state.whitelabel).length === 0) {
            return (
                <PropertyCollapsible
                    name="num_editions"
                    checkboxLabel={getLangText('Specify editions')}>
                    <span>{getLangText('Editions')}</span>
                    <input
                        type="number"
                        placeholder="(e.g. 32)"
                        min={0}/>
                </PropertyCollapsible>
            );
        }
    },

    render() {
        return (
            <RegisterPieceForm
                {...this.props}
                isFineUploaderActive={this.state.isFineUploaderActive}
                handleSuccess={this.handleSuccess}
                location={this.props.location}>
                {this.props.children}
                {this.getSpecifyEditions()}
            </RegisterPieceForm>
        );
    }
});


export default RegisterPiece;
