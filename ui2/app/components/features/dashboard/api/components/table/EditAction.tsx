import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { Modal } from "~/components/ui/modal";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ClipboardCheck, Check } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import { useToast } from "~/hooks/use-toast";
import { action, loader } from "~/routes/dashboard/api/route";

interface EditData extends Record<string, any> {
  id: number;
  platform: string;
  apiKey?: string;
  secret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiration?: string;
  state?: string;
  scope?: string;
  nickname?: string;
  status: string;
  action: string;
  serviceLevel: string;
}

export const EditAction = ({ data }: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<{
    api_key: boolean;
    api_secret: boolean;
    accessToken: boolean;
    refreshToken: boolean;
  }>({
    api_key: false,
    api_secret: false,
    accessToken: false,
    refreshToken: false,
  });
  const [showExpirationField, setShowExpirationField] =
    useState<boolean>(false);
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const { toast } = useToast();
  const [role, setRole] = useState<string | undefined>(undefined);
  const { serviceTypes } = useLoaderData<typeof loader>();

  const handleCopy = (value: string, name: string) => {
    setCopied({
      api_key: false,
      api_secret: false,
      accessToken: false,
      refreshToken: false,
    });

    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied((prevState) => {
          return { ...prevState, [name]: true };
        });
        setTimeout(() => {
          setCopied((prevState) => {
            return { ...prevState, [name]: false };
          });
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const [editData, setEditData] = useState<EditData>({
    id: data.id,
    platform: data.platform,
    apiKey: data.apiKey,
    secret: data.secret,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiration: data.expiration,
    state: data.state,
    scope: data.scope,
    nickname: data.nickname,
    status: data.status,
    action: "edit_api_link",
    serviceLevel: data.serviceLevel,
  });

  const onChange = (property: string, value: any) => {
    setEditData((prev) => {
      return {
        ...prev,
        [property]: value,
      };
    });
  };


  const handleSubmit = async () => {
    submit(editData, { method: "POST" });
  };

  const matches = useMatches();
  const layoutData = matches.find(
    (match) => match.id === "routes/dashboard/_layout"
  );

  useEffect(() => {
    if (
      layoutData?.data &&
      typeof layoutData.data === "object" &&
      "role" in layoutData.data
    ) {
      setRole(layoutData.data.role as string);
    }
  }, [layoutData]);

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      toast({
        title: "Success",
        description: "Successfully updated api connection.",
        variant: "success",
      });
      setIsOpen(false);
    } else if (actionData && "success" in actionData && !actionData.success) {
      toast({
        title: "Error",
        description: "Could not update api connection, please try again.",
        variant: "destructive",
      });
    }
  }, [actionData]);

  return (
    <div className="flex justify-center">
      <Button
        variant="default"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Edit
      </Button>

      <Modal
        title="Edit Api Connection"
        description=""
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ScrollArea className="h-[500px] p-3">
          {/*---- Platform ------*/}
          <div className="my-2">
            <Label htmlFor="plarform">Platform</Label>
            <Input
              className="capitalize"
              defaultValue={editData.platform.replace("_", " ")}
              disabled
            />
          </div>
          {/*---- /Platform ------*/}

          {/*---- Nickname ------*/}
          <div className="my-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              className="capitalize"
              defaultValue={editData.nickname}
              onChange={(e) => {
                onChange("nickname", e.target.value);
              }}
            />
          </div>
          {/*---- /Nickname ------*/}

          {/*---- Service Level ------*/}
          <div className="my-2">
            <Label htmlFor="serviceLevel">Service Level</Label>
            <Select
              defaultValue={editData.serviceLevel}
              onValueChange={(val) => {
                onChange("serviceLevel", val);
              }}
            >
              <SelectContent>
                <SelectGroup>
                  {serviceTypes.map((b: string, idx: number) =>
                    role === "admin" && b === "service_account" ? (
                      <SelectItem
                        value={b}
                        className="capitalize"
                        key={`${editData.id}-${idx}`}
                      >
                        {b.replace("_", " ")}
                      </SelectItem>
                    ) : (
                      <SelectItem
                        value={b}
                        className="capitalize"
                        key={`${editData.id}-${idx}`}
                      >
                        {b.replace("_", " ")}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/*---- /Service Level ------*/}

          {/*---- Api Key ------*/}
          <div className="my-2">
            <Label htmlFor="api_key">API Key</Label>
            <div className="flex items-center">
              <Input
                className="capitalize"
                type="password"
                defaultValue={editData.apiKey}
                onChange={(e) => {
                  onChange("apiKey", e.target.value);
                }}
              />
              <button
                className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-blue-700 dark:border-blue-600 hover:border-blue-800 dark:hover:border-blue-700"
                type="button"
                onClick={() => {
                  handleCopy(editData.apiKey ? data.apiKey : "", "api_key");
                }}
              >
                <span>
                  <ClipboardCheck
                    className={`w-4 h-4 ${!copied.api_key ? "" : "hidden"}`}
                  />
                </span>
                <span className="items-center">
                  <Check
                    className={`w-4 h-4 ${copied.api_key ? "" : "hidden"}`}
                  />
                </span>
              </button>
            </div>
          </div>
          {/*----/ Api Key ------*/}

          {/*---- Api Secret ------*/}
          <div className="my-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <div className="flex items-center">
              <Input
                className="capitalize relative"
                name="apiSecret"
                type="password"
                defaultValue={editData.secret}
                onChange={(e) => {
                  onChange("apiSecret", e.target.value);
                }}
              />
              <button
                className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-blue-700 dark:border-blue-600 hover:border-blue-800 dark:hover:border-blue-700"
                type="button"
                onClick={() => {
                  handleCopy(
                    editData.secret ? editData.secret : "",
                    "api_secret"
                  );
                }}
              >
                <span>
                  <ClipboardCheck
                    className={`w-4 h-4 ${!copied.api_secret ? "" : "hidden"}`}
                  />
                </span>
                <span className="items-center">
                  <Check
                    className={`w-4 h-4 ${copied.api_secret ? "" : "hidden"}`}
                  />
                </span>
              </button>
            </div>
          </div>
          {/*---- /Api Secret ------*/}

          {/*---- Access Token ------*/}
          <div className="my-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <div className="flex items-center">
              <Input
                className="capitalize relative"
                type="password"
                defaultValue={editData.accessToken}
                onChange={(e) => {
                  onChange("accessToken", e.target.value);
                }}
              />
              <button
                className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-blue-700 dark:border-blue-600 hover:border-blue-800 dark:hover:border-blue-700"
                type="button"
                onClick={() => {
                  handleCopy(
                    editData.accessToken ? editData.accessToken : "",
                    "accessToken"
                  );
                }}
              >
                <span>
                  <ClipboardCheck
                    className={`w-4 h-4 ${!copied.accessToken ? "" : "hidden"}`}
                  />
                </span>
                <span className="items-center">
                  <Check
                    className={`w-4 h-4 ${copied.accessToken ? "" : "hidden"}`}
                  />
                </span>
              </button>
            </div>
          </div>
          {/*---- /Access Token ------*/}

          {/*---- Refresh Token ------*/}
          <div className="my-2">
            <Label htmlFor="refreshToken">Refresh Token</Label>
            <div className="flex items-center">
              <Input
                className="capitalize relative"
                type="password"
                defaultValue={editData.refreshToken}
                onChange={(e) => {
                  onChange("refreshToken",e)
                }}
              />
              <button
                className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-blue-700 dark:border-blue-600 hover:border-blue-800 dark:hover:border-blue-700"
                type="button"
                onClick={() => {
                  handleCopy(
                    editData.refreshToken ? editData.refreshToken : "",
                    "refreshToken"
                  );
                }}
              >
                <span>
                  <ClipboardCheck
                    className={`w-4 h-4 ${
                      !copied.refreshToken ? "" : "hidden"
                    }`}
                  />
                </span>
                <span className="items-center">
                  <Check
                    className={`w-4 h-4 ${copied.refreshToken ? "" : "hidden"}`}
                  />
                </span>
              </button>
            </div>
          </div>
          {/*---- /Refresh Token ------*/}

          {/*---- Expiration ------*/}
          <div className="my-2">
            <Label htmlFor="expiration">Expiration</Label>
            {editData.expiration ? (
              <Input
                name="expiration"
                className="col-span-3"
                type="datetime-local"
                defaultValue={editData.expiration}
                onChange={(e) => {
                  onChange("expiration",e.target.value)
                }}
              />
            ) : (
              <>
                {!showExpirationField ? (
                  <Button
                    variant="ghost"
                    className="ml-1"
                    onClick={() => {
                      setShowExpirationField(true);
                    }}
                  >
                    Add Expiration
                  </Button>
                ) : null}

                {showExpirationField ? (
                  <Input
                    name="expiration"
                    className="col-span-3"
                    type="datetime-local"
                    defaultValue={""}
                    onChange={(e) => {
                      onChange("expiration",e);
                    }}
                  />
                ) : null}
              </>
            )}
          </div>
          {/*---- /Expiration ------*/}

          {/*---- State ------*/}
          <div className="my-2">
            <Label htmlFor="state">State</Label>
            <Textarea
              name="state"
              defaultValue={editData.state}
              onChange={(e) => {
                onChange("state",e.target.value);
              }}
            ></Textarea>
          </div>
          {/*---- /State ------*/}

          {/*---- Scope ------*/}
          <div className="my-2">
            <Label htmlFor="scope">Scope</Label>
            <Textarea
              name="scope"
              defaultValue={editData.scope}
              onChange={(e) => {
                onChange("scope", e.target.value)
              }}
            ></Textarea>
          </div>
          {/*---- /Scope ------*/}

          {/*---- Status ------*/}
          <div className="my-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={editData.status}
              onValueChange={(e) => {
                onChange("status", e);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/*---- /Status ------*/}

          <div className="flex justify-end mt-4">
            <Button variant="default" className="mr-2" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </Modal>
    </div>
  );
};
