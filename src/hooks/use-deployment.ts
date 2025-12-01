import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import deploymentService, {type Deployment} from "@/api/services/deployment-service.ts";

const deploymentCache: Record<string, Deployment> = {};

export default function useDeployment() {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;
    const queryDeployment = searchParams.get("deployment") || "";
    const queryNamespace = searchParams.get("namespace") || "";
    const cacheKey = `${queryNamespace}:${queryDeployment}`;

    async function loadDeployment() {
      if (deploymentCache[cacheKey]) {
        setDeployment(deploymentCache[cacheKey]);
      }
      const response = await deploymentService.find({ namespace: queryNamespace, deployment: queryDeployment });
      if (response.success && isMounted) {
        deploymentCache[cacheKey] = response.deployment;
        setDeployment(response.deployment);
      }
    }

    loadDeployment();
    const interval = window.setInterval(loadDeployment, 1000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [searchParams]);

  return deployment;
}
