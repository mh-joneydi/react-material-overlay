export default function mergeClasses<T extends object>(obj1: T, obj2: T): T {
	const merged: any = {};

	for (const key in obj1) {
		if (key in obj1) {
			merged[key] = obj1[key];
		}
	}

	for (const key in obj2) {
		if (key in obj2) {
			merged[key] = merged[key] ? `${merged[key]} ${obj2[key]}` : obj2[key];
		}
	}

	return merged as T;
}
