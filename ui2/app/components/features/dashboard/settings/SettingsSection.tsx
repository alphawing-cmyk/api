import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { SettingsForm } from "./components/SettingsForm";

export const SettingsSection: React.FC = () => {
  return (
    <>
      <div className="overflow-y-auto">
        <SettingsForm />
      </div>
    </>
  );
};
