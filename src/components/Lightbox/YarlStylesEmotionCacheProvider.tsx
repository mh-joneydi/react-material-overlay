import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const yarlStylesCache = createCache({ key: 'yarl', prepend: true });

function YarlStylesEmotionCacheProvider({ children }: React.PropsWithChildren) {
	return <CacheProvider value={yarlStylesCache}>{children}</CacheProvider>;
}

export default YarlStylesEmotionCacheProvider;
