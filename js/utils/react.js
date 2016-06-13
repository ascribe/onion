/**
 * Taken from react-router (https://github.com/reactjs/react-router/blob/master/modules/withRouter.js)
 * FIXME: should be put into react-component's utils
 */
export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
