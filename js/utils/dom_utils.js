'use strict';


/**
 * Get the number of unread notifications in the title.
 *
 * @return {int} the number of unread notifications
 */
function getUnreadCount() {
    const match = document.title.match(/^\((\d+)\)/);
    return parseInt((match ? match[1] : 0), 10);
}


/**
 * Set the title in the browser window while keeping the unread notification count (if any).
 */
export function setDocumentTitle(title) {
    const count = getUnreadCount();
    let newTitle = title;

    if (count > 0) {
        newTitle = `(${count}) ${newTitle}`;
    }

    document.title = newTitle;
}
