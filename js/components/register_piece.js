'use strict';

import React from 'react';

import Router from 'react-router';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import LicenseActions from '../actions/license_actions';
import LicenseStore from '../stores/license_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import UserStore from '../stores/user_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Property from './ascribe_forms/property';
import PropertyCollapsible from './ascribe_forms/property_collapsible';
import RegisterPieceForm from './ascribe_forms/form_register_piece';
//import FormPropertyHeader from './ascribe_forms/form_property_header';

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
            React.PropTypes.element])
    },

    mixins: [Router.Navigation],

    getDefaultProps() {
        return {
            canSpecifyEditions: true
        };
    },

    getInitialState(){
        return mergeOptions(
            LicenseStore.getState(),
            UserStore.getState(),
            WhitelabelStore.getState(),
            PieceListStore.getState(),
            {
                selectedLicense: 0,
                isFineUploaderEditable: false
            });
    },

    componentDidMount() {
        LicenseActions.fetchLicense();
        WhitelabelActions.fetchWhitelabel();
        LicenseStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
    },

    componentWillUnmount() {
        LicenseStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        // once the currentUser object from UserStore is defined (eventually the user was transitioned
        // to the login form via the slider and successfully logged in), we can direct him back to the
        // register_piece slide
        if(state.currentUser && state.currentUser.email || this.state.currentUser && this.state.currentUser.email) {
            this.refs.slidesContainer.setSlideNum(0);
            // we should also make the fineuploader component editable again
            this.setState({
                isFineUploaderEditable: true
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
            this.state.orderAsc);

        this.transitionTo('piece', {pieceId: response.piece.id});
    },

    onLicenseChange(event){
        //console.log(this.state.licenses[event.target.selectedIndex].url);
        this.setState({selectedLicense: event.target.selectedIndex});
    },
    getLicenses() {
        if (this.state.licenses && this.state.licenses.length > 1) {
            return (
                <Property
                    name='license'
                    label={getLangText('Copyright license%s', '...')}
                    onChange={this.onLicenseChange}
                    footer={
                        <a className="pull-right" href={this.state.licenses[this.state.selectedLicense].url} target="_blank">{getLangText('Learn more')}
                        </a>}>
                    <select name="license">
                        {this.state.licenses.map((license, i) => {
                            return (
                                <option
                                    name={i}
                                    key={i}
                                    value={ license.code }>
                                    { license.code.toUpperCase() }: { license.name }
                                </option>
                            );
                        })}
                    </select>
                </Property>);
        }
        return null;
    },

    getSpecifyEditions() {
        if (this.state.whitelabel.acl_editions) {
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

    changeSlide() {
        // only transition to the login store, if user is not logged in
        // ergo the currentUser object is not properly defined
        if(!this.state.currentUser.email) {
            this.refs.slidesContainer.setSlideNum(1);
        }
    },

    render() {
        return (
            <SlidesContainer ref="slidesContainer">
                <div
                    onClick={this.changeSlide}
                    onFocus={this.changeSlide}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                {...this.props}
                                isFineUploaderEditable={this.state.isFineUploaderEditable}
                                handleSuccess={this.handleSuccess}>
                                {this.getSpecifyEditions()}
                                {this.props.children}
                                {this.getLicenses()}
                            </RegisterPieceForm>
                        </Col>
                    </Row>
                </div>
                <div>
                    <LoginContainer
                        message={getLangText('Please login before ascribing your work%s', '...')}
                        redirectOnLoggedIn={false}
                        redirectOnLoginSuccess={false}/>
                </div>
            </SlidesContainer>
        );
    }
});


export default RegisterPiece;
