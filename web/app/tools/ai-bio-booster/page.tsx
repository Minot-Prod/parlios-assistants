import ToolForm from "../../../components/ToolForm";
import { API } from "../../../lib/config";

export default function Page() {
  return (
    <>
      <h2 style={{ margin: "8px 0 14px" }}>AI Bio Booster</h2>
      <ToolForm
        title="Optimiseur de bio LinkedIn/X"
        placeholder="DÃƒÂ©cris ton profil, ton audience et ce que tu veux mettre en avant..."
        endpoint={API.bio}
        buttonLabel="Booster ma bio"
      />
    </>
  );
}


