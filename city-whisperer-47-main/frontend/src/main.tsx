import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSocket, getSocket } from "@/lib/socket";
import { getUser, getToken } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ThemeProvider } from "@/theme";

// Initialize socket and global listeners
const token = getToken();
const socket = initSocket(token);
const user = getUser();
if (user) {
	socket.emit("join", { userId: user.id });
}
socket.on("statusUpdate", ({ issueId, newStatus }) => {
	toast.info(`Issue ${issueId} status updated to ${newStatus}`);
});

// Register Service Worker (in production build)
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((reg) => console.log("SW registered", reg.scope))
			.catch((err) => console.log("SW registration failed", err));
	});
}

createRoot(document.getElementById("root")!).render(
	<ThemeProvider>
		<App />
	</ThemeProvider>
);
