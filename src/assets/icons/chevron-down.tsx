import Svg, { Path, type SvgProps } from "react-native-svg";

export const ChevronDownIcon = ({ fill, ...props }: SvgProps) => (
	<Svg fill="none" viewBox="0 0 24 24" {...props}>
		<Path
			d="M6.957 10.1c.26-.26.682-.26.943 0l4.1 4.1 4.1-4.1a.667.667 0 0 1 .943.943l-4.572 4.572a.667.667 0 0 1-.943 0l-4.571-4.572a.667.667 0 0 1 0-.942Z"
			fill={fill}
		/>
	</Svg>
);
