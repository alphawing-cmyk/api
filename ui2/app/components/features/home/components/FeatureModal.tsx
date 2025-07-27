import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "~/components/ui/alert-dialog";
  import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
  
  function FeatureModal({
    btnTitle,
    modalTitle,
    modalDescription,
  }: {
    btnTitle: string;
    modalTitle: string;
    modalDescription: React.ReactNode;
  }) {
    return (
      <>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="text-white bg-black">{btnTitle}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className={"lg:max-w-screen-lg overflow-y-scroll max-h-[75vh]"}>
                {modalDescription}
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  
  export default FeatureModal;