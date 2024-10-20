import { isValidElement } from 'react';

import { Id } from '../types';

export const isNum = (v: any): v is number => typeof v === 'number' && !isNaN(v);

export const isStr = (v: any): v is string => typeof v === 'string';

export const isFn = (v: any): v is Function => typeof v === 'function';

export const isId = (v: unknown): v is Id => isStr(v) || isNum(v);

export function isReactRef(value: unknown) {
	return !!value && typeof value === 'object' && 'current' in value && value.current !== undefined;
}

export const canBeRendered = <T>(content: T): boolean =>
	isValidElement(content) || isStr(content) || isFn(content) || isNum(content);
