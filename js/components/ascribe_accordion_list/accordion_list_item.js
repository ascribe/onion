'use strict';

import React from 'react';
import Router from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import AccordionListItemEditionWidget from './accordion_list_item_edition_widget';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';

import PieceListActions from '../../actions/piece_list_actions';
import PieceListStore from '../../stores/piece_list_store';

import WhitelabelStore from '../../stores/whitelabel_store';
import WhitelabelActions from '../../actions/whitelabel_actions';

import EditionListActions from '../../actions/edition_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import AclProxy from '../acl_proxy';
import SubmitToPrizeButton from '../ascribe_buttons/submit_to_prize_button';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';

let Link = Router.Link;

let AccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.object
    },

    mixins: [Router.Navigation],

    getInitialState() {
        return mergeOptions(
            {
                showCreateEditionsDialog: false
            },
            PieceListStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getGlyphicon(){
        if (this.props.content.requestAction) {
            return (
                <OverlayTrigger
                    delay={500}
                    placement="left"
                    overlay={<Tooltip>{getLangText('You have actions pending in one of your editions')}</Tooltip>}>
                    <Glyphicon glyph='bell'/>
                </OverlayTrigger>);
        }
        return null;
    },

    toggleCreateEditionsDialog() {
        this.setState({
            showCreateEditionsDialog: !this.state.showCreateEditionsDialog
        });
    },

    handleEditionCreationSuccess() {
        PieceListActions.updatePropertyForPiece({pieceId: this.props.content.id, key: 'num_editions', value: 0});

        this.toggleCreateEditionsDialog();
    },

    handleSubmitPrizeSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);

        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    onPollingSuccess(pieceId, numEditions) {
        PieceListActions.updatePropertyForPiece({
            pieceId,
            key: 'num_editions',
            value: numEditions
        });

        EditionListActions.toggleEditionList(pieceId);

        let notification = new GlobalNotificationModel('Editions successfully created', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getCreateEditionsDialog() {
        if (this.props.content.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div
                    className="ascribe-accordion-list-item-table col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                    <CreateEditionsForm
                        pieceId={this.props.content.id}
                        handleSuccess={this.handleEditionCreationSuccess}/>
                </div>
            );
        }
    },

    getLicences() {
        // convert this to acl_view_licences later
        if (this.state.whitelabel.name === 'Creative Commons France') {
            return (
                <span>
                    <span>, </span>
                    <a href={this.props.content.license_type.url} target="_blank">
                        {getLangText('%s license', this.props.content.license_type.code)}
                    </a>
                </span>
            );
        }
    },

    render() {
        let linkData;

        if (this.props.content.num_editions < 1 || !this.props.content.first_edition) {
            linkData = {
                to: 'piece',
                params: {
                    pieceId: this.props.content.id
                }
            };
        } else {
            linkData = {
                to: 'edition',
                params: {
                    editionId: this.props.content.first_edition.bitcoin_id
                }
            };
        }

        return (
            <div className="row">
                <div className={this.props.className}>
                    <div className="wrapper">
                        <div className="col-xs-4 col-sm-3 col-md-2 col-lg-2 clear-paddings">
                            <div className="thumbnail-wrapper">
                                <Link {...linkData}>
                                    <img src={this.props.content.thumbnail}/>
                                </Link>
                            </div>
                        </div>
                        <div
                            className="col-xs-8 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 accordion-list-item-header">
                            <Link {...linkData}>
                                <h1 className="truncate">{this.props.content.title}</h1>
                            </Link>

                            <h3>{getLangText('by %s', this.props.content.artist_name)}</h3>

                            <div>
                                <span className="pull-left">{this.props.content.date_created.split('-')[0]}</span>

                                <AclProxy
                                    aclObject={this.props.content.acl}
                                    aclName="acl_view_editions">
                                    <AccordionListItemEditionWidget
                                        className="pull-right"
                                        piece={this.props.content}
                                        toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                        onPollingSuccess={this.onPollingSuccess}/>
                                </AclProxy>
                                <AclProxy
                                    show={this.props.content.prize === null}>
                                    <SubmitToPrizeButton
                                        className="pull-right"
                                        piece={this.props.content}
                                        handleSuccess={this.handleSubmitPrizeSuccess}/>
                                </AclProxy>
                                <AclProxy
                                    show={this.props.content.prize}>
                                    <button
                                        disabled
                                        className="btn btn-default btn-xs pull-right">
                                        {getLangText('Submitted to prize')} <span className="glyphicon glyphicon-ok"
                                                                                  aria-hidden="true"></span>
                                    </button>
                                </AclProxy>
                                {this.getLicences()}
                            </div>
                        </div>
                        <span style={{'clear': 'both'}}></span>

                        <div className="request-action-batch">
                            {this.getGlyphicon()}
                        </div>
                    </div>
                </div>

                {this.getCreateEditionsDialog()}

                {/* this.props.children is AccordionListItemTableEditions */}
                {this.props.children}
            </div>
        );
    }
});

export default AccordionListItem;
