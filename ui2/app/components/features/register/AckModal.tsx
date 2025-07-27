import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface AckModalProps {
  accepted: boolean;
  setAccepted: (val: boolean) => void;
}

const AckModal = ({ accepted, setAccepted }: AckModalProps) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex justify-center items-center">
            {
              accepted ?  (<Button variant="blue">Accepted</Button>) : 
              (<Button variant="green">Accept Conditions</Button>)
            }
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept these term and conditions before continuing.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Acceptance of Terms and Conditions
              </h1>

              <p className="text-base text-gray-700 mb-4">
                By accessing or using the automated trading platform Alpha Wing Trading Platform, 
                you agree to comply with and be bound by these Terms
                and Conditions ("Terms"). These Terms govern your use of the
                Platform, including any services, tools, or features provided,
                as well as all transactions and activities conducted through it.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                1. Agreement to Terms
              </h2>
              <p className="text-base text-gray-700 mb-4">
                By creating an account, accessing, or using the Platform, you
                acknowledge that you have read, understood, and accepted these
                Terms. If you do not agree with any part of these Terms, you are
                not authorized to use the Platform and must immediately
                discontinue access to it.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2. Modifications to Terms
              </h2>
              <p className="text-base text-gray-700 mb-4">
                The Platform reserves the right to modify, update, or change
                these Terms at any time, at its sole discretion. Any changes
                will be effective immediately upon posting on the Platform or
                notification to you. It is your responsibility to review these
                Terms periodically to stay informed of any updates.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3. Eligibility
              </h2>
              <p className="text-base text-gray-700 mb-4">
                You confirm that you are legally eligible to use the Platform
                and have the legal capacity to enter into this agreement. You
                also agree that you will comply with all applicable laws and
                regulations when using the Platform.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4. Automated Trading
              </h2>
              <p className="text-base text-gray-700 mb-4">
                The Platform offers automated trading services based on
                algorithms and predefined strategies. You acknowledge and accept
                the risks involved in using such services, including but not
                limited to market volatility, technical failures, and the
                potential for losses. The Platform does not guarantee the
                profitability of any trade, and any trading decisions made by
                the system are done so at your own risk.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5. Account Responsibility
              </h2>
              <p className="text-base text-gray-700 mb-4">
                You are responsible for maintaining the security of your
                account, including your username and password. You agree to
                notify the Platform immediately if you believe your account has
                been compromised or if you suspect unauthorized activity.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6. Fees and Charges
              </h2>
              <p className="text-base text-gray-700 mb-4">
                The Platform may charge fees for the use of its services,
                including but not limited to trading fees, withdrawal fees, and
                other charges as outlined in the Platform's pricing schedule. By
                using the Platform, you agree to pay all applicable fees.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7. Data and Privacy
              </h2>
              <p className="text-base text-gray-700 mb-4">
                Your use of the Platform may involve the collection and
                processing of personal data. Please refer to the Platform's
                Privacy Policy for details on how your data is collected, used,
                and protected.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8. Limitations of Liability
              </h2>
              <p className="text-base text-gray-700 mb-4">
                The Platform and its affiliates, officers, employees, or agents
                shall not be liable for any direct, indirect, incidental,
                special, or consequential damages arising from your use or
                inability to use the Platform, including but not limited to lost
                profits, trading losses, or business interruptions.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                9. Indemnification
              </h2>
              <p className="text-base text-gray-700 mb-4">
                You agree to indemnify and hold harmless the Platform and its
                affiliates, officers, employees, agents, and partners from any
                claims, losses, liabilities, or expenses arising from your use
                of the Platform, including any violations of these Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                10. Termination
              </h2>
              <p className="text-base text-gray-700 mb-4">
                The Platform reserves the right to suspend or terminate your
                account at its sole discretion, including if it believes you
                have violated these Terms, engaged in fraudulent activities, or
                violated any applicable laws. Upon termination, you will no
                longer have access to the services of the Platform.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                11. Governing Law
              </h2>
              <p className="text-base text-gray-700 mb-6">
                These Terms are governed by and construed in accordance with the
                laws of the United States. Any disputes arising from these Terms or
                your use of the Platform shall be resolved in the competent
                courts of the United States.
              </p>

              <div className="flex justify-center mt-6">
                <DialogTrigger asChild>
                  {
                    !accepted ? (
                      <Button
                      className="bg-blue-600 text-white py-2 px-6  hover:bg-blue-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      onClick={() => {
                        setAccepted(true);
                      }}
                    >
                      Accept
                    </Button>
                    ): (
                      <Button
                      className="bg-blue-600 text-white py-2 px-6  hover:bg-blue-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      disabled
                    >
                      Accepted
                    </Button>
                    )
                  }
                </DialogTrigger>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="button">Cancel</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AckModal;
