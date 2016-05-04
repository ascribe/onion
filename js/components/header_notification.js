'use strict';

import React from 'react';
import { Link } from 'react-router';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Nav from 'react-bootstrap/lib/Nav';

import NotificationActions from '../actions/notification_actions';
import NotificationStore from '../stores/notification_store';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';


let HeaderNotification = React.createClass({

    getInitialState() {
        return mergeOptions(
            NotificationStore.getState()
        );
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

    getPieceNotifications(){
        if (this.state.pieceListNotifications && this.state.pieceListNotifications.length > 0) {
            return (
                <div>
                    <div className="notification-header">
                        Artworks ({this.state.pieceListNotifications.length})
                    </div>
                    {this.state.pieceListNotifications.map((pieceNotification, i) => {
                        return (
                            <MenuItem
                                href={`/pieces/${pieceNotification.piece.id}`}
                                key={i}
                                eventKey={i + 2}>
                                <NotificationListItem
                                    ref={i}
                                    notification={pieceNotification.notification}
                                    pieceOrEdition={pieceNotification.piece}/>
                            </MenuItem>
                            );
                        }
                    )}
                </div>
            );
        }
        return null;
    },

    getEditionNotifications(){
        if (this.state.editionListNotifications && this.state.editionListNotifications.length > 0) {
            return (
                <div>
                    <div className="notification-header">
                        Editions ({this.state.editionListNotifications.length})
                    </div>
                    {this.state.editionListNotifications.map((editionNotification, i) => {
                        return (
                            <MenuItem
                                href={`/editions/${editionNotification.edition.bitcoin_id}`}
                                eventKey={i + 2}
                                key={i}>
                                <NotificationListItem
                                    ref={'edition' + i}
                                    notification={editionNotification.notification}
                                    pieceOrEdition={editionNotification.edition}/>
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
            (this.state.editionListNotifications && this.state.editionListNotifications.length > 0)){
            let numNotifications = 0;
            if (this.state.pieceListNotifications && this.state.pieceListNotifications.length > 0) {
                numNotifications += this.state.pieceListNotifications.length;
            }
            if (this.state.editionListNotifications && this.state.editionListNotifications.length > 0) {
                numNotifications += this.state.editionListNotifications.length;
            }
            return (
                <Nav navbar pullRight>
                    <DropdownButton
                        ref='dropdownbutton'
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
            );
        }
        return null;
    }
});

export default HeaderNotification;
