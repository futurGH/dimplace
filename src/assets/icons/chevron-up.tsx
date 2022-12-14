import Svg, { Path, type SvgProps } from "react-native-svg";

export const ChevronUpIcon = ({ fill, ...props }: SvgProps) => (
	<Svg fill="none" viewBox="0 0 24 24" {...props}>
		<Path
			d="M6.957 13.9c.26.26.682.26.943 0L12 9.8l4.1 4.1a.667.667 0 0 0 .943-.943L12.47 8.385a.667.667 0 0 0-.943 0l-4.571 4.572a.667.667 0 0 0 0 .942Z"
			fill={fill}
		/>
	</Svg>
);
