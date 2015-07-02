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
        let slideNum = 0;

        if(queryParams && 'slide_num' in queryParams) {
            slideNum = parseInt(queryParams.slide_num, 10);
        }
        // if slide_num is not set, this will be done in componentDidMount

        return {
            containerWidth: 0,
            slideNum: slideNum
        };
    },

    componentDidMount() {
        // check if slide_num was defined, and if not then default to 0
        let queryParams = this.getQuery();
        if(!('slide_num' in queryParams)) {
            this.transitionTo(this.getPathname(), null, {slide_num: 0});
        }

        // init container width
        this.handleContainerResize();

        // we're using an event listener on window here,
        // as it was not possible to listen to the resize events of a dom node
        window.addEventListener('resize', this.handleContainerResize);
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
        if(slideNum > 0 && slideNum < React.Children.count(this.props.children)) {

            this.transitionTo(this.getPathname(), null, {slide_num: slideNum});
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