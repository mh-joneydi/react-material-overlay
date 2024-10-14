import React from 'react';
import { mergeWith } from 'lodash';

import { isFn, isReactRef } from './propValidator';

export default function enhancedMerge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource {
	return mergeWith({}, object, source, (_, srcValue) => {
		if (isReactRef(srcValue) || React.isValidElement(srcValue) || isFn(srcValue)) {
			return srcValue;
		}
	});
}
