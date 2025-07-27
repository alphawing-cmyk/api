import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

function RoadmapModal() {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="bg-black text-[#FFEE32] w-[200px] rounded-md font-medium  mx-auto md:ml-2
                         my-6 px-6 py-3 cursor-pointer"
          >
            See Roadmap
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Current Road Map</AlertDialogTitle>
            <AlertDialogDescription className="max-h-[50vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <p className="text-base text-gray-500">
                  We are currently working on this platform to bring the latest
                  changes. Currently the roadmap is TBD and will bring this
                  online when it comes into scope.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#4707ea] text-white">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RoadmapModal;
