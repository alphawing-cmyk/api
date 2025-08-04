import ApiClient from "~/lib/apiClient";
import { parseFormValue } from "~/lib/utils";

export async function AddSymbol(request: Request, formData: FormData) {
  const data = [{
    symbol: parseFormValue(formData.get("symbol")),
    name: parseFormValue(formData.get("name")),
    industry: parseFormValue(formData.get("industry")),
    market: parseFormValue(formData.get("market")),
    market_cap: parseFormValue(formData.get("market_cap")),
    alt_names: parseFormValue(formData.get("alt_names")),
  }];

  return await ApiClient("py", "POST", "/symbol/add", request, data);
}
