import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {Web3} from "web3";
import web3 from "../smart-contract/web3"; // Global instance 
import {switchToSepolia} from "../lib/network";

import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import {ChevronDownIcon} from "@chakra-ui/icons";

export default function NavBar() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    try {
      await switchToSepolia();
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {11155111: "https://rpc.sepolia.org"} // Sepolia
          }
        }
      };

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
        theme: "dark"
      });

      const provider = await web3Modal.connect();

      // Update global web3 instance
      web3.setProvider(provider);

      const newWeb3 = new Web3(provider);
      const accounts = await newWeb3.eth.getAccounts();
      setAccount(accounts[0]);

      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        console.log(chainId);
      });

      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        setAccount("");
      });

    } catch (error) {
      console.log(error);
    }
  }

  const disconnectWallet = async () => {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: {}
    });
    web3Modal.clearCachedProvider();
    setAccount("");
  }

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        py={{base: 2}}
        px={{base: 4}}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        boxShadow={"sm"}
        zIndex="999"
        justify={"center"}
        css={{
          backdropFilter: "saturate(180%) blur(5px)",
          backgroundColor: useColorModeValue(
            "rgba(255, 255, 255, 0.8)",
            "rgba(26, 32, 44, 0.8)"
          ),
        }}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex flex={{base: 1}} justify="start" ml={{base: -2, md: 0}}>
            <Heading
              textAlign="left"
              fontFamily={"heading"}
              color={useColorModeValue("teal.800", "white")}
              as="h2"
              size="lg"
            >
              <Box
                as={"span"}
                color={useColorModeValue("teal.400", "teal.300")}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  w: "full",
                  h: "30%",
                  bg: useColorModeValue("teal.100", "teal.900"),
                  zIndex: -1,
                }}
              >
                <NextLink href="/">🤝ClearRaise</NextLink>
              </Box>
            </Heading>
          </Flex>
          <Stack
            flex={{base: 1, md: 0}}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            display={{base: "none", md: "flex"}}
          >
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{base: "none", md: "inline-flex"}}
            >
              <NextLink href="/campaign/new">Create Campaign</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{base: "none", md: "inline-flex"}}
            >
              <NextLink href="/#howitworks"> How it Works</NextLink>
            </Button>

            {account ? (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {account.substr(0, 10) + "..."}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={disconnectWallet}>
                    {" "}
                    Disconnect Wallet{" "}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <div>
                <Button
                  display={{base: "none", md: "inline-flex"}}
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"teal.400"}
                  href={"#"}
                  _hover={{
                    bg: "teal.300",
                  }}
                  onClick={connectWallet}
                >
                  Connect Wallet{" "}
                </Button>
              </div>
            )}

            <DarkModeSwitch />
          </Stack>

          <Flex display={{base: "flex", md: "none"}}>
            <DarkModeSwitch />
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}
