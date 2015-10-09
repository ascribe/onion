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
                            <div className="pull-left">
                                <Link {...this.props.linkData()}>
                                    <div className="thumbnail-wrapper">
                                        {this.props.thumbnail}
                                    </div>
                                </Link>
                            </div>
                            <div className="accordion-list-item-header">
                                <Link {...this.props.linkData()}>
                                    {this.props.heading}
                                </Link>
                                <Link {...this.props.linkData()}>
                                    {this.props.subheading}
                                    {this.props.subsubheading}
                                </Link>
                                <div className="accordion-list-item-buttons">
                                    {this.props.buttons}
                                </div>
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
