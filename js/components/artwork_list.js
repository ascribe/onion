import React from 'react';
import ArtworkListStore from '../stores/artwork_list_store';
import ArtworkListActions from '../actions/artwork_list_actions';


/*
class ArtworkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = ArtworkListStore.getState();
    }

    componentDidMount() {
        ArtworkListStore.listen(this.onChange);
        ArtworkListActions.fetchArtworkList();
    }

    componentWillUnmount() {
        ArtworkListStore.unlisten(this.onChange);
    }

    onChange(state) {
        console.log(this);
        this.setState(state);
    }

    render() {
        console.log('render');
        return (
            <ul>
                {this.state.artworkList.map((artwork) => {
                    return (
                        <li>{artwork.title}</li>
                    );
                })}
            </ul>
        );
    }
};
*/

var ArtworkList = React.createClass({
    getInitialState() {
        return ArtworkListStore.getState();
    },

    componentDidMount() {
        ArtworkListStore.listen(this.onChange);
        ArtworkListActions.fetchArtworkList();
    },

    componentWillUnmount() {
        ArtworkListStore.unlisten(this.onChange);
    },

    onChange(state) {
        console.log(this);
        this.setState(state);
    },

    render() {
        console.log('render');
        return (
            <ul>
                {this.state.artworkList.map((artwork) => {
                    return (
                        <li>{artwork.title}</li>
                    );
                })}
            </ul>
        );
    }
});

export default ArtworkList;
