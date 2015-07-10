'use strict';

import React from 'react';
import Router from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import AccordionListItemEditionWidget from './accordion_list_item_edition_widget';
import AccordionListItemCreateEditions from './accordion_list_item_create_editions';

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
            showCreateEditionsDialog: false,
            creatingEditions: false
        };
    },

    componentDidMount() {
        if(this.props.content.num_editions !== 0) {
            PieceListActions.fetchFirstEditionForPiece(this.props.content.id);
        }
    },

    onChange(state) {
        this.setState(state);
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

    handleEditionCreationSuccess(response) {
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.setState({
            creatingEditions: true
        });

        this.toggleCreateEditionsDialog();

        // start polling until editions are defined
        let pollingIntervalIndex = setInterval(() => {
            EditionListActions.fetchEditionList(this.props.content.id)
            .then((res) => {

                clearInterval(this.state.pollingIntervalIndex);
                
                this.setState({
                    creatingEditions: false
                });

                PieceListActions.updatePropertyForPiece({
                    pieceId: this.props.content.id,
                    key: 'num_editions',
                    value: res.editions[0].num_editions
                });

                EditionListActions.toggleEditionList(this.props.content.id);

            })
            .catch(() => {
                /* Ignore and keep going */
            });
        }, 5000);

        this.setState({
            pollingIntervalIndex
        });
    },

    render() {
        let linkData;

        if(this.props.content.num_editions === 0) {
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
                    editionId: this.props.content.firstEdition ? this.props.content.firstEdition.bitcoin_id : 0
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
                                <span>{this.props.content.date_created.split('-')[0]}</span>
                            </div>
                            <div>
                                <AccordionListItemEditionWidget
                                    piece={this.props.content}
                                    toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}
                                    creatingEditions={this.state.creatingEditions}/>
                                {/* <a href={this.props.content.license_type.url} target="_blank" className="pull-right">
                                    {getLangText('%s license', this.props.content.license_type.code)}
                                </a> */}
                            </div>
                        </div>
                        <span style={{'clear': 'both'}}></span>
                        <div className="request-action-batch">
                            {this.getGlyphicon()}
                        </div>
                    </div>
                </div>
                {this.props.content.num_editions === 0 && this.state.showCreateEditionsDialog ? <AccordionListItemCreateEditions pieceId={this.props.content.id} handleSuccess={this.handleEditionCreationSuccess}/> : null}
                
                {/* this.props.children is AccordionListItemTableEditions */}
                {this.props.children}
            </div>
        );
    }
});

export default AccordionListItem;
