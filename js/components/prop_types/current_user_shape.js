import React from 'react';


const { number, object, shape, string } = React.PropTypes;

export default shape({
    acl: object,
    email: string,
    id: number,
    profile: object,
    username: string
});
