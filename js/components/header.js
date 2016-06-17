'use strict';

import React from 'react';
import { Link } from 'react-router';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import PieceListStore from '../stores/piece_list_store';

import AclProxy from './acl_proxy';
import withContext from './context/with_context';
import HeaderNotifications from './header_notifications';
import HeaderNotificationDebug from './header_notification_debug';
import NavRoutesLinks from './nav_routes_links';
import { currentUserShape, whitelabelShape } from './prop_types';

import { constructHead } from '../utils/dom';
import { getLangText } from '../utils/lang';


let Header = React.createClass({
    propTypes: {
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        // Injected through HOCs
        currentUser: currentUserShape.isRequired, // eslint-disable-line react/sort-prop-types
        isLoggedIn: React.PropTypes.bool.isRequired, // eslint-disable-line react/sort-prop-types
        whitelabel: whitelabelShape.isRequired // eslint-disable-line react/sort-prop-types
    },

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        // Listen to the piece list store, but don't fetch immediately to avoid
        // conflicts with routes that may need to wait to load the piece list
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getLogo() {
        const { whitelabel } = this.props;

        if (whitelabel.head) {
            constructHead(whitelabel.head);
        }

        if (whitelabel.subdomain && whitelabel.subdomain !== 'www' && whitelabel.logo) {
            return (
                <Link to="/collection">
                    <img alt="Whitelabel brand" className="img-brand" src={whitelabel.logo} />
                </Link>
            );
        } else {
            return (
                <Link to="/collection">
                    <span className="icon-ascribe-logo" />
                </Link>
            );
        }
    },

    getPoweredBy() {
        return (
            <a className="pull-left ascribe-powered-by" href="https://www.ascribe.io/" target="_blank">
                <span>{getLangText('powered by')} </span>
                <span className="icon-ascribe-logo"></span>
            </a>
        );
    },

    render() {
        const { currentUser, isLoggedIn, routes, whitelabel } = this.props;
        const { unfilteredPieceListCount } = this.state;

        let account;
        let signup;
        let navRoutesLinks;

        if (isLoggedIn) {
            account = (
                <NavDropdown
                    id="nav-route-user-dropdown"
                    title={currentUser.username}>
                    <LinkContainer to="/settings">
                        <MenuItem>
                            {getLangText('Account Settings')}
                        </MenuItem>
                    </LinkContainer>
                    <AclProxy
                        aclName="acl_view_settings_contract"
                        aclObject={currentUser.acl}>
                        <LinkContainer to="/contract_settings">
                            <MenuItem>
                                {getLangText('Contract Settings')}
                            </MenuItem>
                        </LinkContainer>
                    </AclProxy>
                    <MenuItem divider />
                    <LinkContainer to="/logout">
                        <MenuItem>
                            {getLangText('Log out')}
                        </MenuItem>
                    </LinkContainer>
                </NavDropdown>
            );

            // Let's assume that if the piece list hasn't loaded yet (ie. when
            // unfilteredPieceListCount === -1) then the user has pieces.
            // FIXME: this doesn't work that well as the user may not load their piece list
            // until much later, so we would show the 'Collection' header as available until
            // they actually click on it and get redirected to piece registration.
            navRoutesLinks = (
                <NavRoutesLinks
                    navbar
                    pullRight
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
                    fixedTop
                    className="hidden-print">
                    <Navbar.Header>
                        <Navbar.Brand>
                            {this.getLogo()}
                        </Navbar.Brand>
                        <AclProxy
                            aclName="acl_view_powered_by"
                            aclObject={whitelabel}>
                            {this.getPoweredBy()}
                        </AclProxy>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav navbar pullRight>
                            <HeaderNotificationDebug show={false} />
                            <HeaderNotifications />
                            {account}
                            {signup}
                        </Nav>
                        {navRoutesLinks}
                    </Navbar.Collapse>
                </Navbar>
                <p className="ascribe-print-header visible-print">
                    <span className="icon-ascribe-logo" />
                </p>
            </div>
        );
    }
});

export default withContext(Header, 'currentUser', 'isLoggedIn', 'whitelabel');
