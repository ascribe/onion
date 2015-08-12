'use strict';

import React from 'react';
import Router from 'react-router';

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
        ])
    },

    mixins: [Router.Navigation],

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
        WhitelabelActions.fetchWhitelabel();
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
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

        this.transitionTo('piece', {pieceId: response.piece.id});
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

    // basically redirects to the second slide (index: 1), when the user is not logged in
    onLoggedOut() {
        // only transition to the login store, if user is not logged in
        // ergo the currentUser object is not properly defined
        if(this.state.currentUser && !this.state.currentUser.email) {
            this.refs.slidesContainer.setSlideNum(1);
        }
    },

    onLogin() {
        // once the currentUser object from UserStore is defined (eventually the user was transitioned
        // to the login form via the slider and successfully logged in), we can direct him back to the
        // register_piece slide
        if(this.state.currentUser && this.state.currentUser.email) {
            window.history.back();
        }
    },

    render() {
        return (
            <SlidesContainer 
                ref="slidesContainer"
                forwardProcess={false}>
                <div
                    onClick={this.onLoggedOut}
                    onFocus={this.onLoggedOut}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                {...this.props}
                                isFineUploaderActive={this.state.isFineUploaderActive}
                                handleSuccess={this.handleSuccess}
                                onLoggedOut={this.onLoggedOut}>
                                {this.props.children}
                                {this.getSpecifyEditions()}
                            </RegisterPieceForm>
                        </Col>
                    </Row>
                </div>
                <div>
                    <LoginContainer
                        message={getLangText('Please login before ascribing your work%s', '...')}
                        redirectOnLoggedIn={false}
                        redirectOnLoginSuccess={false}
                        onLogin={this.onLogin}/>
                </div>
            </SlidesContainer>
        );
    }
});


export default RegisterPiece;
