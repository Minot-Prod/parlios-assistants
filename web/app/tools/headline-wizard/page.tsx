import ToolForm from "../../../components/ToolForm";
import { API } from "../../../lib/config";

export default function Page() {
  return (
    <>
      <h2 style={{ margin: "8px 0 14px" }}>Headline Wizard</h2>
      <ToolForm
        title="GÃƒÂ©nÃƒÂ©rateur de titres ÃƒÂ  fort CTR"
        placeholder="DÃƒÂ©cris le contenu/lÃ¢â‚¬â„¢offre/le contexte..."
        endpoint={API.headline}
        buttonLabel="GÃƒÂ©nÃƒÂ©rer mon titre"
      />
    </>
  );
}


