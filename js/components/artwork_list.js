import React from 'react';
import ArtworkListStore from '../stores/artwork_list_store';
import ArtworkListActions from '../actions/artwork_list_actions';


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
        this.setState(state);
    },

    render() {
        return (
            <ul>
                {this.state.artworkList.map((artwork, i) => {
                    return (
                        <li key={i}>{artwork.title}</li>
                    );
                })}
            </ul>
        );
    }
});

export default ArtworkList;
