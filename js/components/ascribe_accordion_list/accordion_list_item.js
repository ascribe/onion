'use strict';

import React from 'react';
import Router from 'react-router';

import PieceListStore from '../../stores/piece_list_store';
import PieceListActions from '../../actions/piece_list_actions';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import AccordionListItemEditionWidget from './accordion_list_item_edition_widget';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.object
    },

    mixins: [Router.Navigation],

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

    render() {
        return (
            <div className="row">
                <div className={this.props.className}>
                    <div className="wrapper">
                        <div className="col-xs-4 col-sm-3 col-md-2 col-lg-2 clear-paddings">
                            <div className="thumbnail-wrapper" onClick={this.handleClick}>
                                <img src={this.props.content.thumbnail} />
                            </div>
                        </div>
                        <div className="col-xs-8 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 accordion-list-item-header">
                            <OverlayTrigger delay={500} placement="left"
                                overlay={<Tooltip>{this.props.content.title}</Tooltip>}>
                                <h1 className="truncate" onClick={this.handleClick}>{this.props.content.title}</h1>
                            </OverlayTrigger>
                            <h3>{getLangText('by %s', this.props.content.artist_name)}</h3>
                            <div>
                                <span>{this.props.content.date_created.split('-')[0]}</span>
                                <AccordionListItemEditionWidget
                                    piece={this.props.content}/>
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
                {this.props.children}
            </div>
        );
    }
});

export default AccordionListItem;
