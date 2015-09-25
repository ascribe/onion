'use strict';

import React from 'react';
import Router from 'react-router';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

import AclProxy from './acl_proxy';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';
import EventActions from '../actions/event_actions';

import HeaderNotifications from './header_notification';

import HeaderNotificationDebug from './header_notification_debug';

import NavRoutesLinks from './nav_routes_links';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';


let Header = React.createClass({
    propTypes: {
        showAddWork: React.PropTypes.bool,
        routes: React.PropTypes.element
    },

    mixins: [Router.State],

    getDefaultProps() {
        return {
            showAddWork: true
        };
    },

    getInitialState() {
        return mergeOptions(
            WhitelabelStore.getState(),
            UserStore.getState()
        );
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

    getLogo(){
        let logo = (
            <span>
                <span>ascribe </span>
                <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
            </span>);
        if (this.state.whitelabel && this.state.whitelabel.logo){
            logo = <img className="img-brand" src={this.state.whitelabel.logo} />;
        }
        return logo;
    },

    getPoweredBy(){
        if (this.state.whitelabel && this.state.whitelabel.logo) {
            return (
                <li>
                    <a className="pull-right" href="https://www.ascribe.io/" target="_blank">
                        <span id="powered">{getLangText('powered by')} </span>
                        <span>ascribe </span>
                        <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                    </a>
                </li>
            );
        }
        return null;
    },
    onChange(state) {
        this.setState(state);

        if(this.state.currentUser && this.state.currentUser.email) {
            EventActions.profileDidLoad.defer(this.state.currentUser);
        }
    },

    onMenuItemClick() {
        /*
        This is a hack to make the dropdown close after clicking on an item
        The function just need to be defined

        from https://github.com/react-bootstrap/react-bootstrap/issues/368:

        @jvillasante - Have you tried to use onSelect with the DropdownButton?
        I don't have a working example that is exactly like yours,
        but I just noticed that the Dropdown closes when I've attached an event handler to OnSelect:

        <DropdownButton eventKey={3} title="Admin" onSelect={ this.OnSelected } >

        onSelected: function(e) {
            // doesn't need to have functionality (necessarily) ... just wired up
        }
        Internally, a call to DropdownButton.setDropDownState(false) is made which will hide the dropdown menu.
        So, you should be able to call that directly on the DropdownButton instance as well if needed.

        NOW, THAT DIDN'T WORK - the onSelect routine isnt triggered in all cases
        Hence, we do this manually
        */
        this.refs.dropdownbutton.setDropdownState(false);
    },

    render() {
        let account;
        let signup;
        let navRoutesLinks;
        if (this.state.currentUser.username){
            account = (
                <DropdownButton
                    ref='dropdownbutton'
                    eventKey="1"
                    title={this.state.currentUser.username}>
                    <MenuItemLink
                        eventKey="2"
                        to="settings"
                        onClick={this.onMenuItemClick}>
                        {getLangText('Account Settings')}
                    </MenuItemLink>
                    <AclProxy
                        aclObject={this.state.currentUser.acl}
                        aclName="acl_view_settings_contract">
                        <MenuItemLink
                            to="contract_settings"
                            onClick={this.onMenuItemClick}>
                            {getLangText('Contract Settings')}
                        </MenuItemLink>
                    </AclProxy>
                    <MenuItem divider />
                    <MenuItemLink eventKey="3" to="logout">{getLangText('Log out')}</MenuItemLink>
                </DropdownButton>
            );
            navRoutesLinks = <NavRoutesLinks routes={this.props.routes} userAcl={this.state.currentUser.acl} navbar right/>;
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
                            {this.getPoweredBy()}
                        </Nav>
                        <Nav navbar right>
                            <HeaderNotificationDebug show={false}/>
                            {account}
                            {signup}
                        </Nav>
                        <HeaderNotifications />
                        {navRoutesLinks}
                    </CollapsibleNav>
                </Navbar>
            </div>
        );
    }
});

export default Header;
