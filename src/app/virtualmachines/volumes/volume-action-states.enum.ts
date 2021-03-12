/**
 * Enum of all possible volume action statuses.
 */
// eslint-disable-next-line no-shadow
export enum VolumeActionStates {
    WAITING = 0,
    SUCCESS = 1,
    ERROR = 2,
    DETACHING_VOLUME = 3,
    SUCCESSFULLY_DETACHED_VOLUME = 4,
    ATTACHING = 5,
    ATTACHING_SUCCESSFULL = 6,
    WAIT_CREATION = 7,
    SUCCESSFULLY_CREATED_ATTACHED = 8,
    CHANGING_NAME = 9,
    CHANGING_NAME_SUCESSFULL = 10
}
