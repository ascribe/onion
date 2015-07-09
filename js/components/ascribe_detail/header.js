'use strict';

import React from 'react';

import EditionDetailProperty from './detail_property';


let Header = React.createClass({
    propTypes: {
        content: React.PropTypes.object
    },

    render() {
        var titleHtml = <div className="ascribe-detail-title">{this.props.content.title}</div>;
        return (
            <div className="ascribe-detail-header">
                <EditionDetailProperty label="TITLE" value={titleHtml} />
                <EditionDetailProperty label="BY" value={this.props.content.artist_name} />
                <EditionDetailProperty label="DATE" value={ this.props.content.date_created.slice(0, 4) } />
                <hr/>
            </div>
        );
    }
});

export default Header;