'use strict';

import React from 'react';
import { History } from 'react-router';
import ReactAddons from 'react/addons';

import SlidesContainerBreadcrumbs from './slides_container_breadcrumbs';


let SlidesContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.arrayOf(React.PropTypes.element),
        forwardProcess: React.PropTypes.bool.isRequired,

        glyphiconClassNames: React.PropTypes.shape({
            pending: React.PropTypes.string,
            complete: React.PropTypes.string
        }),
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState() {
        // handle queryParameters
        let queryParams = this.props.location.query;
        let slideNum = -1;
        let startFrom = -1;

        // We can actually need to check if slide_num is present as a key in queryParams.
        // We do not really care about its value though...
        if(queryParams && 'slide_num' in queryParams) {
            slideNum = parseInt(queryParams.slide_num, 10);
        }
        // if slide_num is not set, this will be done in componentDidMount

        // the query param 'start_from' removes all slide children before the respective number
        // Also, we use the 'in' keyword for the same reason as above in 'slide_num'
        if(queryParams && 'start_from' in queryParams) {
            startFrom = parseInt(queryParams.start_from, 10);
        }

        return {
            slideNum,
            startFrom,
            containerWidth: 0,
            historyLength: window.history.length
        };
    },

    componentDidMount() {
        // check if slide_num was defined, and if not then default to 0
        let queryParams = this.props.location.query;

        // We use 'in' to check if the key is present in the user's browser url bar,
        // we do not really care about its value at this point
        if(!('slide_num' in queryParams)) {

            // we're first requiring all the other possible queryParams and then set
            // the specific one we need instead of overwriting them
            queryParams.slide_num = 0;

            this.history.replaceState(null, this.props.location.pathname, queryParams);
        }

        // init container width
        this.handleContainerResize();

        // we're using an event listener on window here,
        // as it was not possible to listen to the resize events of a dom node
        window.addEventListener('resize', this.handleContainerResize);
    },

    componentWillReceiveProps() {
        let queryParams = this.props.location.query;

        // also check if start_from was updated
        // This applies for example when the user tries to submit a already existing piece
        // (starting from slide 1 for example) and then clicking on + NEW WORK
        if(queryParams && !('start_from' in queryParams)) {
            this.setState({
                startFrom: -1
            });
        }
    },

    componentDidUpdate() {
        let queryParams = this.props.location.query;

        // check if slide_num was defined, and if not then default to 0
        this.setSlideNum(queryParams.slide_num);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleContainerResize);
    },

    handleContainerResize() {
        this.setState({
            // +30 to get rid of the padding of the container which is 15px + 15px left and right
            containerWidth: this.refs.containerWrapper.getDOMNode().offsetWidth + 30
        });
    },

    // When the start_from parameter is used, this.setSlideNum can not simply be used anymore.
    nextSlide() {
        let nextSlide = this.state.slideNum + 1;
        this.setSlideNum(nextSlide);
    },

    // We let every one from the outsite set the page number of the slider,
    // though only if the slideNum is actually in the range of our children-list.
    setSlideNum(slideNum) {

        // we do not want to overwrite other queryParams
        let queryParams = this.props.location.query;

        // slideNum can in some instances be not a number,
        // therefore we have to parse it to one and make sure that its not NaN
        slideNum = parseInt(slideNum, 10);

        // if slideNum is not a number (even after we parsed it to one) and there has
        // never been a transition to another slide (this.state.slideNum ==== -1 indicates that)
        // then we want to "replace" (in this case append) the current url with ?slide_num=0
        if(isNaN(slideNum) && this.state.slideNum === -1) {
            slideNum = 0;
            queryParams.slide_num = slideNum;

            this.history.replaceState(null, this.props.location.pathname, queryParams);
            this.setState({slideNum: slideNum});
            return;

        // slideNum always represents the future state. So if slideNum and
        // this.state.slideNum are equal, there is no sense in redirecting
        } else if(slideNum === this.state.slideNum) {
            return;

        // if slideNum is within the range of slides and none of the previous cases
        // where matched, we can actually do transitions
        } else if(slideNum >= 0 || slideNum < this.customChildrenCount()) {
            
            if(slideNum !== this.state.slideNum - 1) {
                // Bootstrapping the component, getInitialState is called once to save
                // the tabs history length.
                // In order to know if we already pushed a new state  on the history stack or not,
                // we're comparing the old history length with the new one and if it didn't change then
                // we push a new state on it ONCE (ever).
                // Otherwise, we're able to use the browsers history.forward() method
                // to keep the stack clean
                
                if(this.props.forwardProcess) {
                    queryParams.slide_num = slideNum;
                    this.history.pushState(null, this.props.location.pathname, queryParams);
                } else {
                    if(this.state.historyLength === window.history.length) {
                        queryParams.slide_num = slideNum;
                        this.history.pushState(null, this.props.location.pathname, queryParams);
                    } else {
                        window.history.forward();
                    }
                }
            }

            this.setState({
                slideNum: slideNum
            });

        } else {
            throw new Error('You\'re calling a page number that is out of range: ' + slideNum);
        }
    },

    // breadcrumbs are defined as attributes of the slides.
    // To extract them we have to read the DOM element's attributes
    extractBreadcrumbs() {
        let breadcrumbs = [];

        ReactAddons.Children.map(this.props.children, (child, i) => {
            if(child && i >= this.state.startFrom && child.props['data-slide-title']) {
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
        let count = 0;
        React.Children.forEach(this.props.children, (child, i) => {
            if(i >= this.state.startFrom) {
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
                    slideNum={this.state.slideNum}
                    numOfSlides={breadcrumbs.length}
                    containerWidth={this.state.containerWidth}
                    glyphiconClassNames={this.props.glyphiconClassNames}/>
            );
        } else {
            return null;
        }
    },

    // Since we need to give the slides a width, we need to call ReactAddons.addons.cloneWithProps
    // Also, a key is nice to have!
    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child, i) => {

            // since the default parameter of startFrom is -1, we do not need to check
            // if its actually present in the url bar, as it will just not match
            if(child && i >= this.state.startFrom) {
                return ReactAddons.addons.cloneWithProps(child, {
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
        let spacing = this.state.containerWidth * this.state.slideNum;
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

export default SlidesContainer;
