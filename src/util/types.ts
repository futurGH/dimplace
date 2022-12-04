type FilterKeysByValue<O extends object, NotAssignableTo> = {
	[K in keyof O]: O[K] extends NotAssignableTo ? never : K;
}[keyof O];