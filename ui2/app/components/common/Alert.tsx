import { X } from "lucide-react";

function Alert({
  msg,
  type,
  show,
  handleClose,
  id,
}: {
  msg: string | null;
  type: string;
  show: boolean;
  id: string;
  handleClose: (id: string) => void;
}) {
  return (
    <>
      {type === "info" && show && (
        <div className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50">
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">{msg}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg
                       focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex
                       items-center justify-center h-8 w-8"
            onClick={() => {
              handleClose(id);
            }}
          >
            <span className="sr-only">Close</span>
            <X  className= "h-3 w-3"/>
          </button>
        </div>
      )}

      {type === "failure" && show && (
        <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
          <span className="sr-only">Error</span>
          <div className="ml-3 text-sm font-medium">{msg}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400
        	       p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8"
            onClick={() => {
              handleClose(id);
            }}
          >
            <span className="sr-only">Close</span>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {type === "success" && show && (
        <div className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50">
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">{msg}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2
        		       focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center
        		       justify-center h-8 w-8"
            onClick={() => {
              handleClose(id);
            }}
          >
            <span className="sr-only">Close</span>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {type === "warning" && show && (
        <div className="flex items-center p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50">
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">{msg}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg
        	       focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex
        	       items-center justify-center h-8 w-8"
            onClick={() => {
              handleClose(id);
            }}
          >
            <span className="sr-only">Close</span>         
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {type === "command" && show && (
        <div className="flex items-center p-4 rounded-lg bg-gray-50">
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-300">
            {msg}
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-gray-50 text-gray-500 rounded-lg focus:ring-2
        		       focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex items-center
        		       justify-center h-8 w-8"
            onClick={() => {
              handleClose(id);
            }}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-3 w-3"/>
          </button>
        </div>
      )}
    </>
  );
}

export default Alert;
