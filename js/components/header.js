'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';

import Alt from '../alt';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

import HeaderNotificationDebug from './header_notification_debug';


import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';


let Header = React.createClass({
    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions(WhitelabelStore.getState(), UserStore.getState());
    },

    componentDidMount() {
        UserActions.fetchCurrentUser();
        UserStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
        WhitelabelStore.listen(this.onChange);
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    handleLogout(){
        UserActions.logoutCurrentUser();
        Alt.flush();
        this.transitionTo('login');
    },

    getLogo(){
        let logo = (
            <span>
                <span>ascribe </span>
                <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
            </span>);
        if (this.state.whitelabel.logo){
            logo = <img className="img-brand" src={this.state.whitelabel.logo} />;
        }
        return logo;
    },

    getPoweredBy(){
        if (this.state.whitelabel.logo) {
            return (
                <div className="row no-margin ascribe-subheader">
                    <a className="pull-right" href="https://www.ascribe.io/" target="_blank">
                        <span id="powered">{getLangText('powered by')} </span>
                        <span>ascribe </span>
                        <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                    </a>
                </div>);
        }
        return null;
    },
    onChange(state) {
        this.setState(state);
    },

    render() {
        let account = null;
        let signup = null;
        let collection = null;
        let addNewWork = null;
        if (this.state.currentUser.username){
            account = (
                <DropdownButton eventKey="1" title={this.state.currentUser.username}>
                    <MenuItemLink eventKey="2" to="settings">{getLangText('Account Settings')}</MenuItemLink>
                    <MenuItem divider />
                    <MenuItem eventKey="3" onClick={this.handleLogout}>{getLangText('Log out')}</MenuItem>
                  </DropdownButton>
            );
            collection = <NavItemLink to="pieces">{getLangText('COLLECTION')}</NavItemLink>;
            addNewWork = <NavItemLink to="register_piece">+ {getLangText('NEW WORK')}</NavItemLink>;
        }
        else {
            account = <NavItemLink to="login">{getLangText('LOGIN')}</NavItemLink>;
            signup = <NavItemLink to="signup">{getLangText('SIGNUP')}</NavItemLink>;
        }

        return (
            <div>
                <Navbar
                    brand={
                        this.getLogo()
                    }
                    toggleNavKey={0}
                    fixedTop={true}>
                    <CollapsibleNav eventKey={0}>
                        <Nav navbar left>
                        </Nav>
                        <Nav navbar right>
                            <HeaderNotificationDebug />
                            {addNewWork}
                            {collection}
                            {account}
                            {signup}
                        </Nav>
                    </CollapsibleNav>
                </Navbar>
                {this.getPoweredBy()}
            </div>
        );
    }
});

export default Header;
