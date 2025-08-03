import ApiClient from "~/lib/apiClient";
import { parseFormValue } from "~/lib/utils";

export async function DeleteSymbol(request: Request, formData: FormData) {

  const data = {
    id: parseFormValue(formData.get("id")),
  };

  return await ApiClient("py", "DELETE", "/symbol/delete",request,data);
}
