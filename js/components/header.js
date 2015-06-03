import React from 'react';
import Router from 'react-router';

import AltContainer from 'alt/AltContainer';
import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;

let Header = React.createClass({

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserActions.fetchCurrentUser();
        UserStore.listen(this.onChange)
    },

    componentDidUnmount() {
        UserStore.unlisten(this.onChange)
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        return (
            <Navbar>
                <Nav>
                    <a className="navbar-brand" href="#">
                        <span>ascribe </span>
                        <span className="glyph-ascribe-spool-chunked ascribe-color"></span>
                    </a>
                </Nav>
                <Nav right>
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
