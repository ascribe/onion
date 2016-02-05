'use strict';

import React from 'react';
import { Link } from 'react-router';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Nav from 'react-bootstrap/lib/Nav';

import NotificationActions from '../actions/notification_actions';
import NotificationStore from '../stores/notification_store';

import { getLangText } from '../utils/lang_utils';


let HeaderNotifications = React.createClass({
    getInitialState() {
        return NotificationStore.getState();
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
        NotificationActions.fetchPieceListNotifications();
        NotificationActions.fetchEditionListNotifications();
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
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
        const { dropdownButton } = this.refs;

        if (dropdownButton && typeof dropdownButton.setDropdownState === 'function') {
            dropdownbutton.setDropdownState(false);
        }
    },

    getPieceNotifications() {
        if (this.state.pieceListNotifications && this.state.pieceListNotifications.length > 0) {
            return (
                <div>
                    <div className="notification-header">
                        Artworks ({this.state.pieceListNotifications.length})
                    </div>
                    {this.state.pieceListNotifications.map((pieceNotification, i) => {
                        return (
                            <MenuItem eventKey={i + 2}>
                                <NotificationListItem
                                    ref={i}
                                    notification={pieceNotification.notification}
                                    pieceOrEdition={pieceNotification.piece}
                                    onClick={this.onMenuItemClick}/>
                            </MenuItem>
                            );
                        }
                    )}
                </div>
            );
        }
        return null;
    },

    getEditionNotifications() {
        if (this.state.editionListNotifications && this.state.editionListNotifications.length > 0) {
            return (
                <div>
                    <div className="notification-header">
                        Editions ({this.state.editionListNotifications.length})
                    </div>
                    {this.state.editionListNotifications.map((editionNotification, i) => {
                        return (
                            <MenuItem eventKey={i + 2}>
                                <NotificationListItem
                                    ref={'edition' + i}
                                    notification={editionNotification.notification}
                                    pieceOrEdition={editionNotification.edition}
                                    onClick={this.onMenuItemClick}/>
                            </MenuItem>
                            );
                        }
                    )}
                </div>
            );
        }
        return null;
    },

    render() {
        if ((this.state.pieceListNotifications && this.state.pieceListNotifications.length > 0) ||
            (this.state.editionListNotifications && this.state.editionListNotifications.length > 0)) {
            let numNotifications = 0;
            if (this.state.pieceListNotifications && this.state.pieceListNotifications.length > 0) {
                numNotifications += this.state.pieceListNotifications.length;
            }
            if (this.state.editionListNotifications && this.state.editionListNotifications.length > 0) {
                numNotifications += this.state.editionListNotifications.length;
            }
            return (
                <Nav navbar right>
                    <DropdownButton
                        ref='dropdownButton'
                        id="header-notification-dropdown"
                        eventKey="1"
                        title={
                            <span>
                                <Glyphicon glyph='envelope' color="green"/>
                                <span className="notification-amount">({numNotifications})</span>
                            </span>
                        }
                        className="notification-menu">
                        {this.getPieceNotifications()}
                        {this.getEditionNotifications()}
                    </DropdownButton>
                </Nav>
            );
        }
        return null;
    }
});

let NotificationListItem = React.createClass({
    propTypes: {
        notification: React.PropTypes.array,
        pieceOrEdition: React.PropTypes.object,
        onClick: React.PropTypes.func
    },

    isPiece() {
        return !(this.props.pieceOrEdition && this.props.pieceOrEdition.parent);
    },

    getLinkData() {
        let { pieceOrEdition } = this.props;

        if (this.isPiece()) {
            return `/pieces/${pieceOrEdition.id}`;
        } else {
            return `/editions/${pieceOrEdition.bitcoin_id}`;
        }
    },

    onClick(event){
        this.props.onClick(event);
    },

    getNotificationText(){
        let numNotifications = null;
        if (this.props.notification.length > 1){
            numNotifications = <div>+ {this.props.notification.length - 1} {getLangText('more...')}</div>;
        }
        return (
            <div className="notification-action">
                {this.props.notification[0].action_str}
                {numNotifications}
            </div>);
    },

    render() {
        if (this.props.pieceOrEdition) {
            return (
                <Link to={this.getLinkData()} onClick={this.onClick}>
                    <div className="row notification-wrapper">
                        <div className="col-xs-4 clear-paddings">
                            <div className="thumbnail-wrapper">
                                <img src={this.props.pieceOrEdition.thumbnail.url_safe}/>
                            </div>
                        </div>
                        <div className="col-xs-8 notification-list-item-header">
                            <h1>{this.props.pieceOrEdition.title}</h1>
                            <div className="sub-header">by {this.props.pieceOrEdition.artist_name}</div>
                            {this.getNotificationText()}
                        </div>
                    </div>
                </Link>);
        }
        return null;
    }
});

export default HeaderNotifications;
