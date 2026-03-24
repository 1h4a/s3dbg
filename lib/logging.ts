/**
 * Type for the different types of log entries.
 * `response_body` is used to store the response body of, for example, GetObject requests.
 * These entries should not be displayed in the UI, but instead be available for download.
 */
export type EntryType = 'request' | 'response' | 'response_body'

/**
 * Type for all log entries.
 * @extends EntryReference
 * @property {string} contents - Log contents
 *
 * Inherited from `EntryReference`:
 * @property {string} id - Log ID
 * @property {EntryType} type - Log type
 * @property {boolean} attachedBody - Whether the log entry is a Get request with a relevant response_body log. If true,
 * the contents of this log entry will be used to locate the response_body log.
 */
export interface Entry extends EntryReference {
    contents: string,
    attachedBody?: boolean
}

/**
 * Type for log entries that contain data - of type `response_body`.
 * @extends EntryReference
 * @property {string} filename - Filename of the data
 *
 * Inherited from `EntryReference`:
 * @property {string} id - Log ID
 * @property {EntryType} type - Log type
 */
export interface DataEntry extends EntryReference {
    filename: string
}

/**
 * Reference to a log entry.
 *
 * This type should not be used for any log entries directly.
 *
 * Entries to be displayed in the UI should use `Entry`.
 *
 * Entries that are of type `response_body` should use `DataEntry` instead.
 */
interface EntryReference {
    id: string,
    type: EntryType
}

export type EntryUnion = Entry | DataEntry

/**
 * Type for the final generated log file. The key should be the request ID.
 */
export type IndexedLog = Record<string, Entry>