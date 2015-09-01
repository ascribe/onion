'use strict';

import React from 'react';
import Router from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelStore from '../stores/whitelabel_store';
import EventActions from '../actions/event_actions';

import PieceListStore from '../stores/piece_list_store';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

import HeaderNotificationDebug from './header_notification_debug';

import NavRoutesLinks from './nav_routes_links';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;


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
            UserStore.getState(),
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        UserActions.fetchCurrentUser();
        UserStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
        WhitelabelStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
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

    getNotifications() {
        if (this.state.requestActions && this.state.requestActions.length > 0) {
            return (

                <DropdownButton
                    eventKey="1"
                    title={
                        <span>
                            <Glyphicon glyph='envelope' color="green"/>
                            <span className="notification-amount">({this.state.requestActions.length})</span>
                        </span>
                    }
                    className="notification-menu">
                    {this.state.requestActions.map((pieceOrEdition, i) => {
                        return (
                            <MenuItem eventKey={i + 2}>
                                <NotificationListItem
                                    ref={i}
                                    pieceOrEdition={pieceOrEdition}/>
                            </MenuItem>);
                    })
                    }
                </DropdownButton>
            );
        }
        return null;
    },

    render() {
        let account;
        let signup;
        let navRoutesLinks;
        if (this.state.currentUser.username){
            account = (
                <DropdownButton eventKey="1" title={this.state.currentUser.username}>
                    <MenuItemLink eventKey="2" to="settings">{getLangText('Account Settings')}</MenuItemLink>
                    <MenuItem divider />
                    <MenuItemLink eventKey="3" to="logout">{getLangText('Log out')}</MenuItemLink>
                </DropdownButton>
            );
            navRoutesLinks = <NavRoutesLinks routes={this.props.routes} navbar right/>;
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
                            {this.getNotifications()}
                            <HeaderNotificationDebug show={false}/>
                            {account}
                            {signup}
                        </Nav>
                        {navRoutesLinks}
                    </CollapsibleNav>
                </Navbar>
            </div>
        );
    }
});

let NotificationListItem = React.createClass({
    propTypes: {
        pieceOrEdition: React.PropTypes.object
    },

    getLinkData() {

        if(this.props.pieceOrEdition && this.props.pieceOrEdition.bitcoin_id) {
            return {
                to: 'edition',
                params: {
                    editionId: this.props.pieceOrEdition.bitcoin_id
                }
            };
        } else {
            return {
                to: 'piece',
                params: {
                    pieceId: this.props.pieceOrEdition.id
                }
            };
        }

    },

    render() {
        if (this.props.pieceOrEdition) {
            return (
                <Link {...this.getLinkData()}>
                    <div className="row notification-wrapper">
                        <div className="col-xs-4 clear-paddings">
                            <div className="thumbnail-wrapper">
                                <img src={this.props.pieceOrEdition.thumbnail.url_safe}/>
                            </div>
                        </div>
                        <div className="col-xs-8 notification-list-item-header">
                            <h1>{this.props.pieceOrEdition.title}</h1>
                            <div className="sub-header">by {this.props.pieceOrEdition.artist_name}</div>
                            <div className="notification-action">
                                {
                                    this.props.pieceOrEdition.request_action.map((requestAction) => {
                                        return 'Pending ' + requestAction.action + ' request';
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Link>);
        }
        return null;
    }
});

export default Header;
