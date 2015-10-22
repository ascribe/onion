'use strict';

import React from 'react';
import { Link } from 'react-router';

import AccordionListItem from './accordion_list_item';

import { getLangText } from '../../utils/lang_utils';


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

    getLinkData() {
        let { piece } = this.props;

        if(piece && piece.first_edition) {
            return `/editions/${piece.first_edition.bitcoin_id}`;

        } else {
            return `/pieces/${piece.id}`;
        }
    },

    render() {
        const { className, piece, artistName, buttons, badge, children, subsubheading } = this.props;
        const { url, url_safe } = piece.thumbnail;
        let thumbnail;

        // Since we're going to refactor the thumbnail generation anyway at one point,
        // for not use the annoying ascribe_spiral.png, we're matching the url against
        // this name and replace it with a CSS version of the new logo.
        if(url.match(/https:\/\/.*\/media\/thumbnails\/ascribe_spiral.png/)) {
            thumbnail = (
                <span className="ascribe-logo-circle">
                    <span>A</span>
                </span>
            );
        } else {
            thumbnail = (
                <div style={{backgroundImage: 'url("' + url_safe + '")'}}/>
            );
        }

        return (
            <AccordionListItem
                className={className}
                thumbnail={thumbnail}
                heading={<h1>{piece.title}</h1>}
                subheading={
                    <h3>
                        {getLangText('by ')}
                        {artistName ? artistName : piece.artist_name}
                    </h3>
                }
                subsubheading={subsubheading}
                buttons={buttons}
                badge={badge}
                linkData={this.getLinkData()}
                >
                {children}
            </AccordionListItem>
        );
    }
});

export default AccordionListItemPiece;
