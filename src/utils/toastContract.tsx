import { BlockscoutAddressLink } from "components/Links";
import { toast } from "react-toastify";
import { Text } from "theme-ui";

export const toastContract = (address: string) => {
  toast(
    <>
      <Text>Contract deployed! </Text>
      <BlockscoutAddressLink address={address}>
        View on Blockscout
      </BlockscoutAddressLink>
    </>
  );
};
