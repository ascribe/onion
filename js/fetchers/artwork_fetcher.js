import request from 'superagent';

var ArtworkListFetcher = {
    fetch() {
        return request.get('http://staging.ascribe.io/api/users/')
                      .auth('dimi@mailinator.com', '0000000000');
    }
};

export default ArtworkListFetcher;
