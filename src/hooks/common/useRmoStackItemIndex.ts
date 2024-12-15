import React from 'react';

import { RmoStack } from '../../core';
import { Id } from '../../types';

export default function useRmoStackItemIndex(id: Id) {
	return React.useRef(RmoStack.findIndexById(id)).current;
}
