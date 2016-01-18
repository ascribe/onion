'use strict';

import React from 'react';
import { Link } from 'react-router';

import AccordionListItem from './accordion_list_item';
import AccordionListItemThumbnailPlacholder from './accordion_list_item_thumbnail_placeholder';

import { getLangText } from '../../utils/lang_utils';


let AccordionListItemPiece = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        artistName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        piece: React.PropTypes.object.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        subsubheading: React.PropTypes.object,
        buttons: React.PropTypes.object,
        badge: React.PropTypes.object,
        thumbnailPlaceholder: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            thumbnailPlaceholder: AccordionListItemThumbnailPlacholder
        };
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
        const { artistName,
                badge,
                buttons,
                children,
                className,
                piece,
                subsubheading,
                thumbnailPlaceholder: ThumbnailPlaceholder } = this.props;
        const { url: thumbnailUrl, url_safe: thumbnailSafeUrl } = piece.thumbnail;

        // Display the 300x300 thumbnail if we have it, otherwise just use the safe url
        const thumbnailDisplayUrl = (piece.thumbnail.thumbnail_sizes && piece.thumbnail.thumbnail_sizes['300x300']) || thumbnailSafeUrl;

        let thumbnail;

        // Since we're going to refactor the thumbnail generation anyway at one point,
        // for not use the annoying ascribe_spiral.png, we're matching the url against
        // this name and replace it with a CSS version of the new logo.
        if (thumbnailUrl.match(/https:\/\/.*\/media\/thumbnails\/ascribe_spiral.png/)) {
            thumbnail = (<ThumbnailPlaceholder />);
        } else {
            thumbnail = (
                <div style={{backgroundImage: 'url("' + thumbnailDisplayUrl + '")'}} />
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
                linkData={this.getLinkData()}>
                {children}
            </AccordionListItem>
        );
    }
});

export default AccordionListItemPiece;
