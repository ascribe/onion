'use strict';

import React from 'react';
import Router from 'react-router';

import requests from '../../utils/requests';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItem = React.createClass({
    mixins: [Router.Navigation],

    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.object
    },
    handleClick(event){
        requests.get('piece_first_edition_id', {'piece_id': this.props.content.id})
            .then((res) => this.transitionTo('edition', {editionId: res.bitcoin_id}));

        console.log(event.target);
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
                            <h1 onClick={this.handleClick}>{this.props.content.title}</h1>
                            <h3>{getLangText('by %s', this.props.content.artist_name)}</h3>
                            <div>
                                <span>{this.props.content.date_created.split('-')[0]}</span>
                                <a href={this.props.content.license_type.url} target="_blank" className="pull-right">
                                    {this.props.content.license_type.code} license
                                </a>
                            </div>
                        </div>
                        <span style={{'clear': 'both'}}></span>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
});

export default AccordionListItem;
