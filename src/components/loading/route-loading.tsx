import { Progress } from "@/ui/progress";
import { useEffect, useState } from "react";

export function RouteLoading() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let lastHref = window.location.href;
    let timer: number;

		const handleRouteChange = () => {
			setProgress(0);
			let currentProgress = 0;

			const interval = setInterval(() => {
				currentProgress += 2;
				setProgress(currentProgress);
			}, 5);

			timer = setTimeout(() => {
				clearInterval(interval);
				setProgress(100);
				setTimeout(() => setProgress(0), 100);
			}, 500);

			return () => {
				clearInterval(interval);
				clearTimeout(timer);
			};
		};

		const observer = new MutationObserver(() => {
			const currentHref = window.location.href;
			if (currentHref !== lastHref) {
				lastHref = currentHref;
				handleRouteChange();
			}
		});

		observer.observe(document, {
			subtree: true,
			childList: true,
		});

		window.addEventListener("popstate", handleRouteChange);

		handleRouteChange();

		return () => {
			observer.disconnect();
			window.removeEventListener("popstate", handleRouteChange);
			clearTimeout(timer);
		};
	}, []);

	return progress > 0 ? (
		<div className="fixed top-0 left-0 right-0 z-tooltip w-screen">
			<Progress value={progress} className="h-[3px] shadow-2xl" />
		</div>
	) : null;
}
