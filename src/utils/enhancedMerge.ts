import React from 'react';
import { isPlainObject, mergeWith } from 'lodash';

import { isFn, isReactRef } from './propValidator';

export default function enhancedMerge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource {
	return mergeWith({}, object, source, (objValue, srcValue) => {
		if (isReactRef(srcValue) || React.isValidElement(srcValue) || isFn(srcValue)) {
			return srcValue;
		}

		if (!isPlainObject(objValue) || !isPlainObject(srcValue)) {
			return srcValue;
		}

		return undefined;
	});
}
