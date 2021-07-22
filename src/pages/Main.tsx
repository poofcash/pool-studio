import React from "react";
import {
  Container,
  Flex,
  Text,
  Button,
  Label,
  Input,
  Heading,
  Box,
  Link,
} from "theme-ui";
import { useTranslation } from "react-i18next";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAddress } from "utils/address";
import ERC20Poof from "artifacts/ERC20Poof.json";
import { toastContract } from "utils/toastContract";
import { AbiItem, toWei } from "web3-utils";

export const Main: React.FC = () => {
  const { t } = useTranslation();
  const {
    address,
    connect,
    destroy,
    network,
    performActions,
  } = useContractKit();
  const tokenInputRef = React.createRef<any>();
  const denomInputRef = React.createRef<any>();
  const createPoofPool = React.useCallback(
    (tokenAddress: string, denomination: string) => {
      console.log(tokenAddress, denomination);
      performActions(async (kit) => {
        if (!kit.defaultAccount) {
          alert("No connected account detected");
          return;
        }
        const erc20Poof = new kit.web3.eth.Contract(ERC20Poof.abi as AbiItem[]);
        try {
          const contract = await erc20Poof
            .deploy({
              data: ERC20Poof.bytecode.replaceAll(
                "__Hasher________________________________",
                "efEE290D6a341a1555F028954a95240a356b4074"
              ),
              arguments: [
                "0x6aD19D84bB1b4EBa2543Ebf2862EAFD116EA10c5",
                "0x7DA532a6F59232936320011106585521B9F18362",
                denomination,
                20,
                "0x0000000000000000000000000000000000000000",
                tokenAddress,
                "0xce3B62b4FCA7C44d0a3ef7fb80E9E01E53a2b08e",
              ],
            })
            .send({
              from: kit.defaultAccount,
              gas: 2e7,
              gasPrice: toWei("0.5", "gwei"),
            });

          toastContract(contract.options.address);
        } catch (e) {
          console.error("Failed to create a Poof pool", e);
          alert(e);
        }
      });
    },
    [performActions]
  );

  const connectWalletButton = (
    <Button
      sx={{ width: "200px" }}
      onClick={() => {
        connect().catch(console.error);
      }}
    >
      Connect Wallet
    </Button>
  );

  return (
    <>
      <Container>
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "baseline",
            mb: 6,
          }}
        >
          <Container>
            <Heading as="h1">{t("title")}</Heading>
            <Text variant="regularGray">{t("subtitle")}</Text>
          </Container>
          <Box>
            {address ? (
              <>
                <Flex sx={{ alignItems: "baseline", width: "fit-content" }}>
                  <Text variant="bold">Wallet:</Text>
                  <Text ml={2}>{shortenAddress(address)}</Text>
                  <Text
                    sx={{ alignSelf: "center", cursor: "pointer" }}
                    variant="wallet"
                    ml={1}
                    onClick={destroy}
                  >
                    (Disconnect)
                  </Text>
                </Flex>
                <Container mb={3}>
                  <Text variant="bold">Network:</Text>
                  <Text ml={2}>{network.name}</Text>
                </Container>
              </>
            ) : (
              connectWalletButton
            )}
          </Box>
        </Flex>
      </Container>
      <Container>
        <form
          onSubmit={(e) => {
            if (tokenInputRef && denomInputRef) {
              createPoofPool(
                tokenInputRef.current.value,
                denomInputRef.current.value
              );
            }
            e.preventDefault();
          }}
        >
          <Label>ERC20 Address</Label>
          <Box mb={2}>
            <Input
              mr={2}
              placeholder="Enter an ERC20 token address"
              ref={tokenInputRef}
            />
          </Box>
          <Label>Denomination</Label>
          <Box mb={2}>
            <Input
              mr={2}
              placeholder="Enter a denomination"
              ref={denomInputRef}
            />
            <Text>
              NOTE: If your token has 18 decimals and you want to specify a 10
              pool, you will need to enter "10000000000000000000". A great
              utility for this is:{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://eth-converter.com/"
                style={{ textDecoration: "none" }}
              >
                eth-converter
              </Link>
            </Text>
          </Box>
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Button type="submit">Create</Button>
          </Flex>
        </form>
      </Container>
    </>
  );
};
