let updatingToken = false;
export function query<T extends (...args: P) => R, P extends ReadonlyArray<any>, R>(
	errorHandling: Function,
	fn: T,
): T {
	return (async (...args: P) => {
		if (updatingToken) throw new Error("updating token");
		try {
			return await fn(...args);
		} catch (error) {
			updatingToken = true;
			const retry = await errorHandling(error);
			updatingToken = false;
			if (retry) return await fn(...args);
			else throw error;
		}
	}) as T;
}
