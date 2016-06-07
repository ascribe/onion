'use strict';

import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Nav from 'react-bootstrap/lib/Nav';

import NotificationActions from '../actions/notification_actions';
import NotificationStore from '../stores/notification_store';

import { currentUserShape } from './prop_types';

import { getLangText } from '../utils/lang_utils';
import { withCurrentUser } from '../utils/react_utils';


let HeaderNotifications = React.createClass({
    propTypes: {
        // Injected through HOCs
        currentUser: currentUserShape.isRequired, // eslint-disable-line react/sort-prop-types
        isLoggedIn: React.PropTypes.bool.isRequired // eslint-disable-line react/sort-prop-types
    },

    getInitialState() {
        return NotificationStore.getState();
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);

        if (this.props.isLoggedIn) {
            this.refreshNotifications();
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser && nextProps.currentUser.email !== this.props.currentUser.email) {
            this.refreshNotifications();
        }
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    refreshNotifications() {
        NotificationActions.fetchPieceListNotifications();
        NotificationActions.fetchEditionListNotifications();
    },

    renderNotifications({ notifications, isPiece }) {
        if (notifications.length) {
            return (
                <div>
                    <div className="notification-header">
                        {`${(isPiece ? 'Artworks' : 'Editions')} (${notifications.length})`}
                    </div>
                    {notifications.map((notification, i) => {
                        const pieceOrEdition = isPiece ? notification.piece : notification.edition;
                        const href = isPiece ? `/pieces/${pieceOrEdition.id}`
                                             : `/editions/${pieceOrEdition.bitcoin_id}`;

                        return (
                            <MenuItem
                                key={href}
                                eventKey={i + 2}
                                href={href}>
                                <NotificationListItem
                                    notification={notification.notification}
                                    pieceOrEdition={pieceOrEdition} />
                            </MenuItem>
                        );
                    })}
                </div>
            );
        } else {
            return null;
        }
    },

    render() {
        const { editionListNotifications, pieceListNotifications } = this.state;
        if (pieceListNotifications.length || editionListNotifications.length) {
            let numNotifications = 0;

            if (pieceListNotifications.length) {
                numNotifications += pieceListNotifications.length;
            }
            if (editionListNotifications.length) {
                numNotifications += editionListNotifications.length;
            }

            return (
                <Nav navbar pullRight>
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
                        {this.renderNotifications({ notifications: pieceListNotifications, isPiece: true })}
                        {this.renderNotifications({ notifications: editionListNotifications, isPiece: false })}
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

export default withCurrentUser(HeaderNotifications);
