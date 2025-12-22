import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import nodeService, {type Node} from "@/api/services/node-service.ts";

const nodeCache: Record<string, Node> = {};

export default function useNode() {
  const [node, setNode] = useState<Node | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryNode = searchParams.get("node") || "";
    const cacheKey = `${queryNode}`;

    async function loadNode() {
      if (nodeCache[cacheKey]) {
        setNode(nodeCache[cacheKey]);
      }
      const response = await nodeService.find({ name: queryNode });
      if (response.success && isMounted) {
        nodeCache[cacheKey] = response.node;
        setNode(response.node);
      }
    }

    loadNode();
    const interval = window.setInterval(loadNode, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return node;
}
