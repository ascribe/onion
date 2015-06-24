'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import Alt from '../alt';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';


import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;

let Header = React.createClass({
    mixins: [Router.Navigation],

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserActions.fetchCurrentUser();
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },
    handleLogout(){
        UserActions.logoutCurrentUser();
        Alt.flush();
        this.transitionTo('login');
    },
    onChange(state) {
        this.setState(state);
    },

    render() {
        let account = null;
        let signup = null;
        if (this.state.currentUser.username){
            account = (
                <DropdownButton eventKey="1" title={this.state.currentUser.username}>
                    <MenuItemLink to="settings">{getLangText('Account Settings')}</MenuItemLink>
                    <li className="divider"></li>
                    <MenuItem eventKey="2" href="/art/faq/">{getLangText('FAQ')}</MenuItem>
                    <MenuItem eventKey="3" href="/art/terms/">{getLangText('Terms of Service')}</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey="4" onClick={this.handleLogout}>{getLangText('Log out')}</MenuItem>
                  </DropdownButton>
            );
        }
        else {
            account = <NavItemLink to="login">LOGIN</NavItemLink>;
            signup = <NavItemLink to="signup">SIGNUP</NavItemLink>;
        }
        let brand = (<Link className="navbar-brand" to="pieces" path="/?page=1">
                        <span>ascribe </span>
                        <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                    </Link>);
        return (

            <Navbar brand={brand} toggleNavKey={0}>
                <CollapsibleNav eventKey={0}>
                    <Nav navbar right>
                        {account}
                        {signup}
                    </Nav>
                </CollapsibleNav>
            </Navbar>
        );
    }
});

export default Header;
