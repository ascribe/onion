'use strict';

import React from 'react';
import withRouter from 'react-router/es6/withRouter';

import SlidesContainerBreadcrumbs from './slides_container_breadcrumbs';


const { arrayOf, element, bool, shape, string, object } = React.PropTypes;

const SlidesContainer = React.createClass({
    propTypes: {
        forwardProcess: bool.isRequired,
        router: object.isRequired,

        children: arrayOf(element),
        glyphiconClassNames: shape({
            pending: string,
            complete: string
        }),
        location: object,
        pageExitWarning: string
    },

    contextTypes: {
        route: object.isRequired
    },

    getInitialState() {
        return {
            containerWidth: 0,
            pageExitWarning: null
        };
    },

    componentDidMount() {
        // we're using an event listener on window here,
        // as it was not possible to listen to the resize events of a dom node
        window.addEventListener('resize', this.handleContainerResize);

        // Initially, we need to dispatch 'resize' once to render correctly
        window.dispatchEvent(new Event('resize'));

        // Since react-router 2.0.0, we need to define the `routerWillLeave`
        // method ourselves.
        this.props.router.setRouteLeaveHook(this.context.route, this.routerWillLeave);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleContainerResize);
    },

    routerWillLeave() {
        return this.props.pageExitWarning;
    },

    handleContainerResize() {
        this.setState({
            // +30 to get rid of the padding of the container which is 15px + 15px left and right
            containerWidth: this.refs.containerWrapper.offsetWidth + 30
        });
    },

    // When the start_from parameter is used, this.setSlideNum can not simply be used anymore.
    nextSlide(additionalQueryParams) {
        const slideNum = parseInt(this.props.location.query.slide_num, 10) || 0;
        this.setSlideNum(slideNum + 1, additionalQueryParams);
    },

    setSlideNum(nextSlideNum, additionalQueryParams = {}) {
        const { location: { pathname, query }, router } = this.props;
        const slideQuery = Object.assign({}, query, additionalQueryParams, { slide_num: nextSlideNum });

        router.push({ pathname, query: slideQuery });
    },

    // breadcrumbs are defined as attributes of the slides.
    // To extract them we have to read the DOM element's attributes
    extractBreadcrumbs() {
        const startFrom = parseInt(this.props.location.query.start_from, 10) || -1;
        const breadcrumbs = [];

        React.Children.map(this.props.children, (child, i) => {
            if(child && i >= startFrom && child.props['data-slide-title']) {
                breadcrumbs.push(child.props['data-slide-title']);
            }
        });

        return breadcrumbs;
    },

    // If startFrom is defined as a URL parameter, this can manipulate
    // the number of children that are injected into the DOM.
    // Therefore React.Children.count does not work anymore and we
    // need to implement our own method.
    customChildrenCount() {
        const startFrom = parseInt(this.props.location.query.start_from, 10) || -1;
        let count = 0;

        React.Children.forEach(this.props.children, (child, i) => {
            if(i >= startFrom) {
                count++;
            }
        });

        return count;
    },

    renderBreadcrumbs() {
        let breadcrumbs = this.extractBreadcrumbs();
        let numOfChildren = this.customChildrenCount();

        // check if every child/slide has a title,
        // otherwise do not display the breadcrumbs at all
        // Also, if there is only one child, do not display the breadcrumbs
        if(breadcrumbs.length === numOfChildren && breadcrumbs.length > 1 && numOfChildren > 1) {
            return (
                <SlidesContainerBreadcrumbs
                    breadcrumbs={breadcrumbs}
                    slideNum={parseInt(this.props.location.query.slide_num, 10) || 0}
                    numOfSlides={breadcrumbs.length}
                    containerWidth={this.state.containerWidth}
                    glyphiconClassNames={this.props.glyphiconClassNames}/>
            );
        } else {
            return null;
        }
    },

    // Since we need to give the slides a width, we need to call React.cloneElement
    // Also, a key is nice to have!
    renderChildren() {
        const startFrom = parseInt(this.props.location.query.start_from, 10) || -1;

        return React.Children.map(this.props.children, (child, i) => {
            // since the default parameter of startFrom is -1, we do not need to check
            // if its actually present in the url bar, as it will just not match
            if(child && i >= startFrom) {
                return React.cloneElement(child, {
                    className: 'ascribe-slide',
                    style: {
                        width: this.state.containerWidth
                    },
                    key: i
                });
            } else {
                // Abortions are bad mkay
                return null;
            }

        });
    },

    render() {
        let spacing = this.state.containerWidth * parseInt(this.props.location.query.slide_num, 10) || 0;
        let translateXValue = 'translateX(' + (-1) * spacing + 'px)';

        /*
            According to the react documentation,
            all browser vendor prefixes need to be upper cases in the beginning except for
            the Microsoft one *bigfuckingsurprise*
            https://facebook.github.io/react/tips/inline-styles.html
        */

        return (
            <div
                className="container ascribe-sliding-container-wrapper"
                ref="containerWrapper">
                {this.renderBreadcrumbs()}
                <div
                    className="container ascribe-sliding-container"
                    style={{
                        width: this.state.containerWidth * this.customChildrenCount(),
                        transform: translateXValue,
                        WebkitTransform: translateXValue,
                        MozTransform: translateXValue,
                        OTransform: translateXValue,
                        mstransform: translateXValue
                    }}>
                    <div className="row">
                        {this.renderChildren()}
                    </div>
                </div>
            </div>
        );
    }
});

export default withRouter(SlidesContainer);
