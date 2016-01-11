'use strict';

import React from 'react';
import { Link } from 'react-router';


let AccordionListItem = React.createClass({
    propTypes: {
        badge: React.PropTypes.object,
        className: React.PropTypes.string,
        thumbnail: React.PropTypes.object,
        heading: React.PropTypes.object,
        subheading: React.PropTypes.object,
        subsubheading: React.PropTypes.object,
        buttons: React.PropTypes.object,
        linkData: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    render() {
        const {
            linkData,
            className,
            thumbnail,
            heading,
            subheading,
            subsubheading,
            buttons,
            badge,
            children } = this.props;

        return (
            <div className="row">
                <div className={className}>
                    <div className="wrapper">
                            <div className="pull-left">
                                <Link to={linkData}>
                                    <div className="thumbnail-wrapper">
                                        {thumbnail}
                                    </div>
                                </Link>
                            </div>
                            <div className="accordion-list-item-header">
                                <Link to={linkData}>
                                    {heading}
                                </Link>
                                <Link to={linkData}>
                                    {subheading}
                                    {subsubheading}
                                </Link>
                                <div className="accordion-list-item-buttons">
                                    {buttons}
                                </div>
                            </div>

                        <span style={{'clear': 'both'}}></span>

                        <div className="request-action-badge">
                            {badge}
                        </div>
                    </div>
                </div>
                {children}
            </div>
        );
    }
});

export default AccordionListItem;
