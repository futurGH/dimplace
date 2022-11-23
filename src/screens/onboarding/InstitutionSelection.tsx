import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import {
	getInstitutionInfo,
	getInstitutionList,
	type InstitutionList,
} from "../../api/institutions";
import { Container } from "../../components/Container";
import { Input } from "../../components/Input";
import type { StackParamList } from "../../components/layout/NavigationWrapper";
import { List, type ListItemProps } from "../../components/List";
import { useStoreActions, useStoreState } from "../../store/store";

const fuse = new Fuse<ListItemProps>([], { keys: ["title", "subtitle"] });

const apiInstitutionListToDisplay = (list: InstitutionList): Array<ListItemProps> => {
	return list.map((institution, i) => ({
		key: institution.name + i,
		title: institution.name,
		subtitle: institution.links.lms || "Link not found",
	}));
};

export function InstitutionSelection(
	{ navigation }: NativeStackScreenProps<StackParamList, "InstitutionSelection">,
) {
	const [filter, setFilter] = useState("");
	const [institutionList, setInstitutionList] = useState<Array<ListItemProps>>([]);

	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	useEffect(() => {
		getInstitutionList(filter).then((data) => {
			const listToDisplay = apiInstitutionListToDisplay(data);
			fuse.setCollection(listToDisplay);
			setInstitutionList(fuse.search(filter).map((result) => result.item));
		});
	}, [filter]);
	return (
		<Container>
			<List
				ListHeaderComponent={
					<Input
						value={filter}
						onChangeText={setFilter}
						placeholder="Who provides your learning?"
						autoCapitalize="none"
						clearButtonMode="always"
						containerStyle={{ marginBottom: 12 }}
					/>
				}
				data={institutionList}
				onItemPress={(item) => {
					if (!item.subtitle) return;
					getInstitutionInfo(item.subtitle).then((info) => {
						if (!info?.tenantId) return;
						configActions.setTenantId(info.tenantId);
						const authUrl = `https://auth.brightspace.com/oauth2/auth?`
							+ `client_id=${(config.clientId)}&`
							+ `tenant_id=${info.tenantId}&`
							+ `response_type=code&`
							+ `redirect_uri=brightspacepulse://auth&`
							+ `scope=*:*:read%20core:*:*%20updates:devices:create%20updates:devices:delete%20content:topics:mark-read%20assignments:folder:submit`;

						navigation.navigate("AuthWebView", { source: authUrl });
					});
				}}
			/>
		</Container>
	);
}
