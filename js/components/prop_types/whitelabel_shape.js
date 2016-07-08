import React from 'react';


const { shape, string } = React.PropTypes;

const whitelabelShapeSpec = {
    name: string.isRequired,
    subdomain: string.isRequired,
    title: string.isRequired,
    user: string.isRequired
};

export default shape(whitelabelShapeSpec);
export {
    whitelabelShapeSpec
};
