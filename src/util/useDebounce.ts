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
