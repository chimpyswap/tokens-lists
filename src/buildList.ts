import fs from "fs";
import path from "path";
import { TokenList } from "@uniswap/token-lists";
import { version as pancakeswapDefaultVersion } from "../lists/pancakeswap-default.json";
import { version as pancakeswapExtendedVersion } from "../lists/pancakeswap-extended.json";
import { version as pancakeswapTop15Version } from "../lists/pancakeswap-top-15.json";
import { version as pancakeswapTop100Version } from "../lists/pancakeswap-top-100.json";
import pancakeswapDefault from "./tokens/pancakeswap-default.json";
import pancakeswapExtended from "./tokens/pancakeswap-extended.json";
import pancakeswapTop100 from "./tokens/pancakeswap-top-100.json";
import pancakeswapTop15 from "./tokens/pancakeswap-top-15.json";

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "pancakeswap-default": {
    list: pancakeswapDefault,
    name: "ChimpySwap Default",
    keywords: ["pancakeswap", "default"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x026a3918A6D6F7B7b1b6887B8B650143b5d04732/logo.png",
    sort: false,
    currentVersion: pancakeswapDefaultVersion,
  },
  "pancakeswap-extended": {
    list: pancakeswapExtended,
    name: "ChimpySwap Extended",
    keywords: ["pancakeswap", "extended"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x026a3918A6D6F7B7b1b6887B8B650143b5d04732/logo.png",
    sort: true,
    currentVersion: pancakeswapExtendedVersion,
  },
  "pancakeswap-top-100": {
    list: pancakeswapTop100,
    name: "ChimpySwap Top 100",
    keywords: ["pancakeswap", "top 100"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x026a3918A6D6F7B7b1b6887B8B650143b5d04732/logo.png",
    sort: true,
    currentVersion: pancakeswapTop100Version,
  },
  "pancakeswap-top-15": {
    list: pancakeswapTop15,
    name: "ChimpySwap Top 15",
    keywords: ["pancakeswap", "top 15"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x026a3918A6D6F7B7b1b6887B8B650143b5d04732/logo.png",
    sort: true,
    currentVersion: pancakeswapTop15Version,
  },
};

const getNextVersion = (currentVersion: Version, versionBump?: VersionBump) => {
  const { major, minor, patch } = currentVersion;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

export const buildList = (listName: string, versionBump?: VersionBump): TokenList => {
  const { list, name, keywords, logoURI, sort, currentVersion } = lists[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CHIMPY first in extended list
            if ((t1.symbol === "CHIMPY") !== (t2.symbol === "CHIMPY")) {
              return t1.symbol === "CHIMPY" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList: TokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
