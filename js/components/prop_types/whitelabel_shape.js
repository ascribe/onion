import React from 'react';


const { shape, string } = React.PropTypes;

const whitelabelShapeSpec = {
    name: string,
    subdomain: string,
    title: string,
    user: string
};

export default shape(whitelabelShapeSpec);
export {
    whitelabelShapeSpec
};
