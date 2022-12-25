import { useCallback, useEffect } from "react";

export function useDebounce(
	effect: (...args: never) => unknown,
	dependencies: ReadonlyArray<unknown>,
	delay: number,
) {
	const callback = useCallback(effect, dependencies);

	useEffect(() => {
		const timeout = setTimeout(callback, delay);
		return () => clearTimeout(timeout);
	}, [callback, delay]);
}

export function debounce<T extends ReadonlyArray<any>>(
	callback: (...args: T) => unknown,
	delay: number,
) {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	return (...args: T) => {
		if (timeout) return;
		timeout = setTimeout(() => {
			callback(...args);
			timeout = undefined;
		}, delay);
	};
}
