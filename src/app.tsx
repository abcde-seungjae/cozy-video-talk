import { createRoot } from "react-dom/client";
import Popup from "./components/popup";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<Popup />);
