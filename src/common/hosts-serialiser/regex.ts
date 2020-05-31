/*
Identities a record has being IP4.
*/
export const ipV4Record = /^\s*#*\s*(?:[0-9]{1,3}\.){3}[0-9]{1,3}\s+([^#]+)/;

/*
Identities a record has being IP6.
*/
export const ipV6Record = /^\s*#*\s*(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\s+([^#]+)/;

/*
Identifies is a line has a leading comment.
*/
export const leadingComment = /^\s*#\s*/;

/*
Identifies the start of a category block.
 */
export const startOfCategoryBlock = /^####Category:(?<name>.*)####$/

/*
Identifies the start of an entry block.
 */
export const startOfEntryBlock = /^####Entry:(?<name>.*)####$/
