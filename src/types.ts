export type Id = number | string;

export type Notify = () => void;

/**
 * Runs before a stack pop.
 * Return `false`, or a promise that resolves to `false`, to cancel that pop.
 */
export type PopInterceptor = () => boolean | Promise<boolean>;
