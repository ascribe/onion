'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import ModalWrapper from '../components/ascribe_modal/modal_wrapper';
import LoginForm from '../components/ascribe_forms/form_login';

import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;

let Header = React.createClass({

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
    handleLoginSuccess(){
        UserActions.fetchCurrentUser();
    },

    render() {
        return (
            <Navbar>
                <Nav>
                    <Link className="navbar-brand" to="pieces">
                        <span>ascribe </span>
                        <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                    </Link>
                </Nav>
                <Nav right>
                    <ModalWrapper
                        button={<div className='btn btn-default btn-sm'>LOGIN</div>}
                        title='Log in to ascribe'
                        handleSuccess={this.handleLoginSuccess}
                        tooltip='Log in to ascribe'>
                        <LoginForm />
                    </ModalWrapper>
                    <DropdownButton eventKey="1" title={this.state.currentUser.username}>
                        <MenuItem eventKey="1" href="/art/account_settings/">{getLangText('Account Settings')}</MenuItem>
                        <li className="divider"></li>
                        <MenuItem eventKey="2" href="/art/faq/">{getLangText('FAQ')}</MenuItem>
                        <MenuItem eventKey="3" href="/art/terms/">{getLangText('Terms of Service')}</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4" href="/api/users/logout/">{getLangText('Log out')}</MenuItem>
                  </DropdownButton>
                </Nav>
            </Navbar>
        );
    }
});

export default Header;
