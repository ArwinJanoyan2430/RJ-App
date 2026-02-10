import { LoaderIcon } from "lucide-react";
import "../index.css";

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <LoaderIcon className="w-16 h-16 animate-spin" />
      <h1 className="text-lg font-semibold">Made by Arwin Janoyan</h1>
    </div>

  );
}

export default PageLoader;
