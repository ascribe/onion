'use strict';

import React from 'react';
import Router from 'react-router';

import AccordionListItem from './accordion_list_item';

import { getLangText } from '../../utils/lang_utils';

let Link = Router.Link;


let AccordionListItemPiece = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        artistName: React.PropTypes.string,
        piece: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        subsubheading: React.PropTypes.object,
        buttons: React.PropTypes.object,
        badge: React.PropTypes.object
    },

    mixins: [Router.Navigation],

    getLinkData() {

        if(this.props.piece && this.props.piece.first_edition) {
            return {
                to: 'edition',
                params: {
                    editionId: this.props.piece.first_edition.bitcoin_id
                }
            };
        } else {
            return {
                to: 'piece',
                params: {
                    pieceId: this.props.piece.id
                }
            };
        }
        
    },

    render() {
        return (
            <AccordionListItem
                className={this.props.className}
                thumbnail={
                    <Link {...this.getLinkData()}>
                        <img src={this.props.piece.thumbnail.url_safe}/>
                    </Link>}
                heading={
                    <Link {...this.getLinkData()}>
                        <h1>{this.props.piece.title}</h1>
                    </Link>}
                subheading={
                    <h3>
                        {getLangText('by ')}
                        {this.props.artistName ? this.props.artistName : this.props.piece.artist_name}
                    </h3>
                }
                subsubheading={this.props.subsubheading}
                buttons={this.props.buttons}
                badge={this.props.badge}
                >
                {this.props.children}
            </AccordionListItem>
        );
    }
});

export default AccordionListItemPiece;
