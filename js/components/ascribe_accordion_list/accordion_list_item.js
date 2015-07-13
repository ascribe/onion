'use strict';

import React from 'react';
import Router from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import AccordionListItemEditionWidget from './accordion_list_item_edition_widget';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';

import PieceListActions from '../../actions/piece_list_actions';
import EditionListActions from '../../actions/edition_list_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getLangText } from '../../utils/lang_utils';

let Link = Router.Link;

let AccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.object
    },

    mixins: [Router.Navigation],

    getInitialState() {
        return {
            showCreateEditionsDialog: false
        };
    },

    getGlyphicon(){
        if (this.props.content.requestAction){
            return (
                <OverlayTrigger delay={500} placement="left"
                            overlay={<Tooltip>{getLangText('You have actions pending in one of your editions')}</Tooltip>}>
                        <Glyphicon glyph='bell' />
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

    onPollingSuccess(pieceId, numEditions) {
        PieceListActions.updatePropertyForPiece({
            pieceId,
            key: 'num_editions',
            value: numEditions
        });

        EditionListActions.toggleEditionList(pieceId);
    },

    getCreateEditionsDialog() {
        if(this.props.content.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div className="ascribe-accordion-list-item-table col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2">
                    <CreateEditionsForm
                        pieceId={this.props.content.id}
                        handleSuccess={this.handleEditionCreationSuccess} />
                </div>
            );
        }
    },

    render() {
        let linkData;

        if(this.props.content.num_editions < 1) {
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
                    editionId: this.props.content.first_edition ? this.props.content.first_edition.bitcoin_id : 0
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
                                    <img src={this.props.content.thumbnail} />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xs-8 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 accordion-list-item-header">
                            <Link {...linkData}>
                                <h1 className="truncate">{this.props.content.title}</h1>
                            </Link>
                            <h3>{getLangText('by %s', this.props.content.artist_name)}</h3>
                            <div>
                                <span className="pull-left">{this.props.content.date_created.split('-')[0]}</span>
                                <AccordionListItemEditionWidget
                                    className="pull-right"
                                    piece={this.props.content}
                                    toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                    onPollingSuccess={this.onPollingSuccess}/>
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
