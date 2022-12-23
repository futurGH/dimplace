import { useCallback, useState } from "react";

export function useRefreshing(
	refetch: Function,
	handleErrors?: (error: unknown) => void,
): [boolean, () => void] {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const refresh = useCallback(async () => {
		try {
			setIsRefreshing(true);
			await refetch();
		} catch (error) {
			handleErrors?.(error);
		} finally {
			setIsRefreshing(false);
		}
	}, [refetch]);

	return [isRefreshing, refresh];
}
