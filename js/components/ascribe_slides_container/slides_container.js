'use strict';

import React from 'react';
import ReactAddons from 'react/addons';

let SlidesContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.arrayOf(React.PropTypes.element)
    },

    getInitialState() {
        return {
            containerWidth: 0,
            pageNum: 0
        };
    },

    componentDidMount() {
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
    // though only if the pageNum is actually in the range of our children-list.
    setPageNum(pageNum) {
        if(pageNum > 0 && pageNum < React.Children.count(this.props.children)) {
            this.setState({
                pageNum: pageNum
            });
        } else {
            throw new Error('You\'re calling a page number that is out of range.');
        }
        console.log(this.state);
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
                        transform: 'translateX(' + (-1) * this.state.containerWidth * this.state.pageNum + 'px)'
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