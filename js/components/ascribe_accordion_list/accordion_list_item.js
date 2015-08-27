'use strict';

import React from 'react';
import Router from 'react-router';

let AccordionListItem = React.createClass({
    propTypes: {
        badge: React.PropTypes.object,
        className: React.PropTypes.string,
        thumbnail: React.PropTypes.object,
        heading: React.PropTypes.object,
        subheading: React.PropTypes.object,
        subsubheading: React.PropTypes.object,
        buttons: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    mixins: [Router.Navigation],

    render() {

        return (
            <div className="row">
                <div className={this.props.className}>
                    <div className="wrapper">
                        <div className="col-xs-4 col-sm-3 col-md-2 col-lg-2 clear-paddings">
                            <div className="thumbnail-wrapper">
                                {this.props.thumbnail}
                            </div>
                        </div>
                        <div className="col-xs-8 col-sm-9 col-md-9 col-lg-9 col-md-offset-1 col-lg-offset-1 accordion-list-item-header">
                            {this.props.heading}
                            {this.props.subheading}
                            {this.props.subsubheading}
                            {this.props.buttons}
                        </div>
                        <span style={{'clear': 'both'}}></span>

                        <div className="request-action-badge">
                            {this.props.badge}
                        </div>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
});

export default AccordionListItem;
