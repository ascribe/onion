import request from 'superagent';

var ArtworkListFetcher = {
    fetch() {
        return request.get('http://staging.ascribe.io/api/pieces/?page=1&page_size=10')
                      .auth('dimi@mailinator.com', '0000000000');
    }
};

export default ArtworkListFetcher;
