'use strict';

import React from 'react';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.object
    },

    render() {
        return (
            <div className="row">
                <div className={this.props.className}>
                    <div className="wrapper">
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 thumbnail-wrapper">
                            <img src={this.props.content.thumbnail} />
                        </div>
                        <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                            <h1>{this.props.content.title}</h1>
                            <h3>{getLangText('by %s', this.props.content.artist_name)}</h3>
                            <h3>{this.props.content.date_created.split('-')[0]}</h3>
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
