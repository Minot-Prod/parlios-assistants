import ToolForm from "../../../components/ToolForm";
import { API } from "../../../lib/config";

export default function Page() {
  return (
    <>
      <h2 style={{ margin: "8px 0 14px" }}>Smart Summary</h2>
      <ToolForm
        title="RÃƒÂ©sumeur intelligent avec actions"
        placeholder="Colle ton texte/URL, ou dÃƒÂ©cris le document ÃƒÂ  rÃƒÂ©sumer..."
        endpoint={API.summary}
        buttonLabel="RÃƒÂ©sumer"
      />
    </>
  );
}


