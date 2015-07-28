'use strict';

import React from 'react';
import Router from 'react-router';
import ReactAddons from 'react/addons';

let State = Router.State;
let Navigation = Router.Navigation;

let SlidesContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.arrayOf(React.PropTypes.element)
    },

    mixins: [State, Navigation],

    getInitialState() {
        // handle queryParameters
        let queryParams = this.getQuery();
        let slideNum = -1;

        if(queryParams && 'slide_num' in queryParams) {
            slideNum = parseInt(queryParams.slide_num, 10);
        }
        // if slide_num is not set, this will be done in componentDidMount

        return {
            containerWidth: 0,
            slideNum: slideNum,
            historyLength: window.history.length
        };
    },

    componentDidMount() {
        // init container width
        this.handleContainerResize();

        // we're using an event listener on window here,
        // as it was not possible to listen to the resize events of a dom node
        window.addEventListener('resize', this.handleContainerResize);
    },

    componentDidUpdate() {
        // check if slide_num was defined, and if not then default to 0
        let queryParams = this.getQuery();
        this.setSlideNum(queryParams.slide_num);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleContainerResize);
    },

    handleContainerResize() {
        this.setState({
            containerWidth: this.refs.containerWrapper.getDOMNode().offsetWidth
        });
    },

    // We let every one from the outsite set the page number of the slider,
    // though only if the slideNum is actually in the range of our children-list.
    setSlideNum(slideNum) {

        // slideNum can in some instances be not a number,
        // therefore we have to parse it to one and make sure that its not NaN
        slideNum = parseInt(slideNum, 10);

        // if slideNum is not a number (even after we parsed it to one) and there has
        // never been a transition to another slide (this.state.slideNum ==== -1 indicates that)
        // then we want to "replace" (in this case append) the current url with ?slide_num=0
        if(isNaN(slideNum) && this.state.slideNum === -1) {
            slideNum = 0;

            this.replaceWith(this.getPathname(), null, {slide_num: slideNum});
            this.setState({slideNum: slideNum});
            return;

        // slideNum always represents the future state. So if slideNum and
        // this.state.slideNum are equal, there is no sense in redirecting
        } else if(slideNum === this.state.slideNum) {
            return;

        // if slideNum is within the range of slides and none of the previous cases
        // where matched, we can actually do transitions
        } else if(slideNum >= 0 || slideNum < React.Children.count(this.props.children)) {
            
            if(slideNum !== this.state.slideNum - 1) {
                // Bootstrapping the component, getInitialState is called once to save
                // the tabs history length.
                // In order to know if we already pushed a new state  on the history stack or not,
                // we're comparing the old history length with the new one and if it didn't change then
                // we push a new state on it ONCE (ever).
                // Otherwise, we're able to use the browsers history.forward() method
                // to keep the stack clean
                if(this.state.historyLength === window.history.length) {
                    this.transitionTo(this.getPathname(), null, {slide_num: slideNum});
                } else {
                    window.history.forward();
                }
            }

            this.setState({
                slideNum: slideNum
            });

        } else {
            throw new Error('You\'re calling a page number that is out of range.');
        }
    },

    // Since we need to give the slides a width, we need to call ReactAddons.addons.cloneWithProps
    // Also, a key is nice to have!
    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child, i) => {
            return ReactAddons.addons.cloneWithProps(child, {
                className: 'ascribe-slide',
                style: {
                    width: this.state.containerWidth
                },
                key: i
            });
        });
    },

    render() {
        return (
            <div
                className="container ascribe-sliding-container-wrapper"
                ref="containerWrapper">
                <div
                    className="container ascribe-sliding-container"
                    style={{
                        width: this.state.containerWidth * React.Children.count(this.props.children),
                        transform: 'translateX(' + (-1) * this.state.containerWidth * this.state.slideNum + 'px)'
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
