'use strict';

import React from 'react';
import Router from 'react-router';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Nav from 'react-bootstrap/lib/Nav';

import PieceListStore from '../stores/piece_list_store';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';

let Link = Router.Link;


let HeaderNotifications = React.createClass({

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        if (this.state.requestActions && this.state.requestActions.length > 0) {
            return (
                <Nav navbar right>
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
                            }
                        )}
                    </DropdownButton>
                </Nav>
            );
        }
        return null;
    }
});

let NotificationListItem = React.createClass({
    propTypes: {
        pieceOrEdition: React.PropTypes.object
    },

    getLinkData() {

        if(this.props.pieceOrEdition && this.props.pieceOrEdition.parent) {
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

export default HeaderNotifications;
