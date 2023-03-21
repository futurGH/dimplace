import Svg, { Path, type SvgProps } from "react-native-svg";

export const SearchIcon = ({ fill, ...props }: SvgProps) => (
	<Svg fill="none" viewBox="0 0 24 24" {...props}>
		<Path
			d="M9.714 4.572a5.143 5.143 0 1 0 0 10.285 5.143 5.143 0 0 0 0-10.285ZM3.43 9.714a6.286 6.286 0 1 1 12.571 0 6.286 6.286 0 0 1-12.571 0Z"
			fill={fill}
		/>
		<Path
			d="M13.308 13.313a.571.571 0 0 1 .808-.006l6.367 6.286a.571.571 0 0 1-.803.813l-6.367-6.285a.572.572 0 0 1-.005-.809Z"
			fill={fill}
		/>
	</Svg>
);
