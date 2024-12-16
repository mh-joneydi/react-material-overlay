import React from 'react';
import { Theme } from '@mui/material';
import { isFunction, merge, mergeWith } from 'lodash';

import { isFn, isReactRef } from './propValidator';

export default function enhancedMerge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource {
	return mergeWith({}, object, source, (value, srcValue, key) => {
		if (isReactRef(srcValue) || React.isValidElement(srcValue) || isFn(srcValue)) {
			return srcValue;
		}

		if (key === 'sx' && value && srcValue && (isFunction(value) || isFunction(srcValue))) {
			return (theme: Theme) =>
				merge(
					{},
					isFunction(value) ? (value as Function)(theme) : (value ?? {}),
					isFunction(srcValue) ? (srcValue as Function)(theme) : (srcValue ?? {})
				);
		}

		return undefined;
	});
}
