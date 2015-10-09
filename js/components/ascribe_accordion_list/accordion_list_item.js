'use strict';

import React from 'react';
import Router from 'react-router';

let Link = Router.Link;

let AccordionListItem = React.createClass({
    propTypes: {
        badge: React.PropTypes.object,
        className: React.PropTypes.string,
        thumbnail: React.PropTypes.object,
        heading: React.PropTypes.object,
        subheading: React.PropTypes.object,
        subsubheading: React.PropTypes.object,
        buttons: React.PropTypes.object,
        linkData: React.PropTypes.func,
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
                        <Link {...this.props.linkData()}>
                            <div className="pull-left">
                                <div className="thumbnail-wrapper">
                                    {this.props.thumbnail}
                                </div>
                            </div>
                            <div className="pull-left accordion-list-item-header">
                                {this.props.heading}
                                {this.props.subheading}
                                {this.props.subsubheading}
                            </div>
                        </Link>
                        <div className="accordion-list-item-buttons">
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
