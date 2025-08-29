"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { fetchPastEventsPaginated } from "@/pages/api/events";
import abi from "@/abi/event.json";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);

  const RPC_HTTP = process.env.NEXT_PUBLIC_BSC_RPC_URL;
  const RPC_WS = process.env.NEXT_PUBLIC_BSC_WSS_URL;

  const contractAddress = process.env.NEXT_PUBLIC_STORAGE_CONTRACT;
  const eventName = "EVTUser";

  // Load past events with pagination
  const loadEvents = async (p) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_HTTP);
      const res = await fetchPastEventsPaginated(
        provider,
        contractAddress,
        abi,
        eventName,
        5000,
        p
      );

      setEvents((prev) => [...res.events, ...prev]);
    } catch (err) {
      console.error("Error loading past events:", err);
    }
  };

  // Subscribe to new live events
  useEffect(() => {
    const wsProvider = new ethers.WebSocketProvider(RPC_WS);
    const contract = new ethers.Contract(contractAddress, abi, wsProvider);

    const listener = (...args) => {
      const event = args[args.length - 1]; // last param is the Event object
      console.log("New Event:", event);
      setEvents((prev) => [event, ...prev]); // prepend live event
    };

    // Directly use the event name function from ABI
    contract.on("EVTUser", listener);

    return () => {
      contract.off("EVTUser", listener);
      wsProvider.destroy();
    };
  }, []);

  // Load history when page changes
  useEffect(() => {
    loadEvents(page);
  }, [page]);

  return (
    <div>
      <h1>Past + Live Events</h1>
      <button onClick={() => setPage(page + 1)}>Load More</button>

      <ul>
        {events.map((e, idx) => (
          <li key={idx}>
            {e.args?.account} —{" "}
            {new Date(Number(e.args?.timestamp) * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
