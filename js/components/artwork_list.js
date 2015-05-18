import React from 'react';
import ArtworkFetcher from '../fetchers/artwork_fetcher';
import ArtworkListStore from '../stores/artwork_list_store';


class ArtworkList extends React.Component {
    componentDidMount() {
        ArtworkFetcher.fetch().end();
    }

    getInitialState() {

    }

    render() {
        return (
            <ul>
                <li>This is an artwork</li>
            </ul>
        );
    }
};

export default ArtworkList;
