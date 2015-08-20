'use strict';

import React from 'react';

import Col from 'react-bootstrap/lib/Col';


// Note:
//
// If we ever need generic breadcrumbs component, we should refactor this
let SlidesContainerBreadcrumbs = React.createClass({
    propTypes: {
        breadcrumbs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        
        slideNum: React.PropTypes.number.isRequired,
        numOfSlides: React.PropTypes.number.isRequired,

        containerWidth: React.PropTypes.number.isRequired,

        glyphiconClassNames: React.PropTypes.shape({
            pending: React.PropTypes.string,
            complete: React.PropTypes.string
        })
    },

    getDefaultProps() {
        return {
            glyphiconClassNames: {
                pending: 'glyphicon glyphicon-chevron-right',
                complete: 'glyphicon glyphicon-lock'
            }
        };
    },

    render() {
        let breadcrumbs = this.props.breadcrumbs;
        let numSlides = breadcrumbs.length;
        let columnWidth = Math.floor(12 / numSlides);

        return (
            <div className="row" style={{width: this.props.containerWidth}}>
                <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                    <div className="no-margin row ascribe-breadcrumb-container">
                        {breadcrumbs.map((breadcrumb, i) => {

                            // Depending on the progress the user has already made, we display different
                            // glyphicons that can also be specified from the outside
                            let glyphiconClassName;

                            if(i >= this.props.slideNum) {
                                glyphiconClassName = this.props.glyphiconClassNames.pending;
                            } else {
                                glyphiconClassName = this.props.glyphiconClassNames.completed;
                            }

                            return (
                                <Col
                                    className="no-padding"
                                    sm={columnWidth}
                                    key={i}>
                                    <div className="ascribe-breadcrumb">
                                        <a className={this.props.slideNum === i ? 'active' : ''}>
                                            {breadcrumb}
                                        <span className={i === numSlides - 1 ? 'invisible' : '' + 'pull-right ' + glyphiconClassName}>
                                        </span>
                                        </a>
                                    </div>
                                </Col>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
});

export default SlidesContainerBreadcrumbs;