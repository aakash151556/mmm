import { ethers } from "ethers";

export async function fetchPastEventsPaginated(provider, contractAddress, abi, eventName, pageSize, page) {
  if (!provider) throw new Error("Provider is required");

  // Create contract with provider (read-only)
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Get the latest block
  const latestBlock = await provider.getBlockNumber();

  // Calculate block range for pagination
  const fromBlock = Math.max(latestBlock - (page + 1) * pageSize, 0);
  const toBlock = latestBlock - page * pageSize;

  console.log(`Fetching events from ${fromBlock} to ${toBlock}`);

  // Create the filter dynamically
  const filter = contract.filters[eventName]();

  // Query events in the range
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return {
    page,
    pageSize,
    fromBlock,
    toBlock,
    events
  };
}
