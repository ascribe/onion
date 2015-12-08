'use strict';

import React from 'react';
import { Link } from 'react-router';

import history from '../history';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

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

import { constructHead } from '../utils/dom_utils';


let Header = React.createClass({
    propTypes: {
        showAddWork: React.PropTypes.bool,
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

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
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser.defer();

        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel.defer();

        // react-bootstrap 0.25.1 has a bug in which it doesn't
        // close the mobile expanded navigation after a click by itself.
        // To get rid of this, we set the state of the component ourselves.
        history.listen(this.onRouteChange);
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
        //history.unlisten(this.onRouteChange);
    },

    getLogo() {
        let { whitelabel } = this.state;

        if (whitelabel.head) {
            constructHead(whitelabel.head);
        }

        if (whitelabel.subdomain && whitelabel.subdomain !== 'www' && whitelabel.logo){
            return (
                <Link to="/collection">
                    <img className="img-brand" src={whitelabel.logo} alt="Whitelabel brand"/>
                </Link>
            );
        }

        return (
            <span>
                <Link className="icon-ascribe-logo" to="/collection"/>
            </span>
        );
    },

    getPoweredBy(){
        return (
            <AclProxy
                aclObject={this.state.whitelabel}
                aclName="acl_view_powered_by">
                    <li>
                        <a className="pull-right ascribe-powered-by" href="https://www.ascribe.io/" target="_blank">
                            <span id="powered">{getLangText('powered by')} </span>
                            <span className="icon-ascribe-logo"></span>
                        </a>
                    </li>
            </AclProxy>
        );
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

    // On route change, close expanded navbar again since react-bootstrap doesn't close
    // the collapsibleNav by itself on click. setState() isn't available on a ref so
    // doing this explicitly is the only way for now.
    onRouteChange() {
        this.refs.navbar.state.navExpanded = false;
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
                    <LinkContainer
                        to="/settings"
                        onClick={this.onMenuItemClick}>
                        <MenuItem
                            eventKey="2">
                            {getLangText('Account Settings')}
                        </MenuItem>
                    </LinkContainer>
                    <AclProxy
                        aclObject={this.state.currentUser.acl}
                        aclName="acl_view_settings_contract">
                        <LinkContainer
                            to="/contract_settings"
                            onClick={this.onMenuItemClick}>
                            <MenuItem
                                eventKey="2">
                                {getLangText('Contract Settings')}
                            </MenuItem>
                        </LinkContainer>
                    </AclProxy>
                    <MenuItem divider />
                    <LinkContainer
                        to="/logout">
                        <MenuItem
                            eventKey="3">
                            {getLangText('Log out')}
                        </MenuItem>
                    </LinkContainer>
                </DropdownButton>
            );
            navRoutesLinks = <NavRoutesLinks routes={this.props.routes} userAcl={this.state.currentUser.acl} navbar right/>;
        }
        else {
            account = (
                <LinkContainer
                    to="/login">
                    <NavItem>
                        {getLangText('LOGIN')}
                    </NavItem>
                </LinkContainer>
            );
            signup = (
                <LinkContainer
                    to="/signup">
                    <NavItem>
                        {getLangText('SIGNUP')}
                    </NavItem>
                </LinkContainer>
            );
        }

        return (
            <div>
                <Navbar
                    brand={this.getLogo()}
                    toggleNavKey={0}
                    fixedTop={true}
                    ref="navbar">
                    <CollapsibleNav
                        eventKey={0}>
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
