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

import EventActions from '../actions/event_actions';

import PieceListStore from '../stores/piece_list_store';

import AclProxy from './acl_proxy';
import HeaderNotifications from './header_notification';
import HeaderNotificationDebug from './header_notification_debug';
import NavRoutesLinks from './nav_routes_links';

import { getLangText } from '../utils/lang_utils';
import { constructHead } from '../utils/dom_utils';


let Header = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        whitelabel: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        // Listen to the piece list store, but don't fetch immediately to avoid
        // conflicts with routes that may need to wait to load the piece list
        PieceListStore.listen(this.onChange);

        // react-bootstrap 0.25.1 has a bug in which it doesn't
        // close the mobile expanded navigation after a click by itself.
        // To get rid of this, we set the state of the component ourselves.
        history.listen(this.onRouteChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        //history.unlisten(this.onRouteChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getLogo() {
        const { whitelabel } = this.props;

        if (whitelabel.head) {
            constructHead(whitelabel.head);
        }

        if (whitelabel.subdomain && whitelabel.subdomain !== 'www' && whitelabel.logo){
            return (
                <Link to="/collection">
                    <img className="img-brand" src={whitelabel.logo} alt="Whitelabel brand"/>
                </Link>
            );
        } else {
            return (
                <span>
                    <Link className="icon-ascribe-logo" to="/collection"/>
                </span>
            );
        }
    },

    getPoweredBy() {
        return (
            <AclProxy
                aclObject={this.props.whitelabel}
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
        if (this.refs.navbar) {
            this.refs.navbar.state.navExpanded = false;
        }
    },

    render() {
        const { currentUser, routes  } = this.props;
        const { unfilteredPieceListCount } = this.state;

        let account;
        let signup;
        let navRoutesLinks;

        if (currentUser.username) {
            account = (
                <DropdownButton
                    ref='dropdownbutton'
                    id="nav-route-user-dropdown"
                    eventKey="1"
                    title={currentUser.username}>
                    <LinkContainer
                        to="/settings"
                        onClick={this.onMenuItemClick}>
                        <MenuItem eventKey="2">
                            {getLangText('Account Settings')}
                        </MenuItem>
                    </LinkContainer>
                    <AclProxy
                        aclObject={currentUser.acl}
                        aclName="acl_view_settings_contract">
                        <LinkContainer
                            to="/contract_settings"
                            onClick={this.onMenuItemClick}>
                            <MenuItem eventKey="2">
                                {getLangText('Contract Settings')}
                            </MenuItem>
                        </LinkContainer>
                    </AclProxy>
                    <MenuItem divider />
                    <LinkContainer to="/logout">
                        <MenuItem eventKey="3">
                            {getLangText('Log out')}
                        </MenuItem>
                    </LinkContainer>
                </DropdownButton>
            );

            // Let's assume that if the piece list hasn't loaded yet (ie. when unfilteredPieceListCount === -1)
            // then the user has pieces
            // FIXME: this doesn't work that well as the user may not load their piece list
            // until much later, so we would show the 'Collection' header as available until
            // they actually click on it and get redirected to piece registration.
            navRoutesLinks = (
                <NavRoutesLinks
                    navbar
                    right
                    hasPieces={!!unfilteredPieceListCount}
                    routes={routes}
                    userAcl={currentUser.acl} />
            );
        } else {
            account = (
                <LinkContainer to="/login">
                    <NavItem>
                        {getLangText('LOGIN')}
                    </NavItem>
                </LinkContainer>
            );
            signup = (
                <LinkContainer to="/signup">
                    <NavItem>
                        {getLangText('SIGNUP')}
                    </NavItem>
                </LinkContainer>
            );
        }

        return (
            <div>
                <Navbar
                    ref="navbar"
                    brand={this.getLogo()}
                    toggleNavKey={0}
                    fixedTop={true}
                    className="hidden-print">
                    <CollapsibleNav eventKey={0}>
                        <Nav navbar left>
                            {this.getPoweredBy()}
                        </Nav>
                        <Nav navbar right>
                            <HeaderNotificationDebug show={false} />
                            {account}
                            {signup}
                        </Nav>
                        <HeaderNotifications />
                        {navRoutesLinks}
                    </CollapsibleNav>
                </Navbar>
                <p className="ascribe-print-header visible-print">
                    <span className="icon-ascribe-logo" />
                </p>
            </div>
        );
    }
});

export default Header;
