'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import apiUrls from '../constants/api_urls.js';
import PieceListActions from '../actions/piece_list_actions';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import LoginModal from '../components/ascribe_modal/modal_login';
import SignupModal from '../components/ascribe_modal/modal_signup';


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

    onChange(state) {
        this.setState(state);
    },

    refreshData(){
        location.reload();
    },
    render() {
        let account = null;
        let signup = null;
        if (this.state.currentUser.username){
            account = (
                <DropdownButton eventKey="1" title={this.state.currentUser.username}>
                        <MenuItem eventKey="1" href="/art/account_settings/">{getLangText('Account Settings')}</MenuItem>
                        <li className="divider"></li>
                        <MenuItem eventKey="2" href="/art/faq/">{getLangText('FAQ')}</MenuItem>
                        <MenuItem eventKey="3" href="/art/terms/">{getLangText('Terms of Service')}</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4" href={apiUrls.users_logout}>{getLangText('Log out')}</MenuItem>
                  </DropdownButton>
            );
        }
        else {
            account = (
                <LoginModal
                    button={<NavItem to="pieces">LOGIN</NavItem>}
                    handleSuccess={this.refreshData}/>);
            signup = (
                <SignupModal
                    button={<NavItem to="pieces">SIGNUP</NavItem>} />);
        }
        return (
            <Navbar>
                <Nav>
                    <Link className="navbar-brand" to="pieces">
                        <span>ascribe </span>
                        <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                    </Link>
                </Nav>
                <Nav right>
                    {account}
                    {signup}
                </Nav>
            </Navbar>
        );
    }
});

export default Header;
