function AccountTypeInfoAction({
  account_type,
}: {
  account_type: string | undefined;
}) {
  return account_type === "paper_account" ? (
    <div className="text-center font-bold">Paper Account</div>
  ) : account_type === "live_account" ? (
    <div className="text-center font-bold">Live Account</div>
  ) : account_type === "service_account" ? (
    <div className="text-center font-bold">Service Account</div>
  ) : (
    <div className="text-center font-bold">N/A</div>
  );
}

export default AccountTypeInfoAction;
