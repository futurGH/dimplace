import { Switch } from "react-native";
import { Colors } from "../../styles";

export interface ToggleSwitchProps {
	value: boolean;
	disabled?: boolean;
	onToggle: (enabled: boolean) => void;
}
export function ToggleSwitch({ value, disabled, onToggle }: ToggleSwitchProps) {
	return (
		<Switch
			trackColor={{ false: Colors.Border, true: Colors.Active }}
			thumbColor={disabled ? Colors.Inactive : Colors.TextPrimary}
			ios_backgroundColor={Colors.Border}
			onValueChange={onToggle}
			value={disabled ? false : value}
			disabled={disabled}
		/>
	);
}
