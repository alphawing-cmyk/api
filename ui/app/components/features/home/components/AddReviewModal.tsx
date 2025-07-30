import { X } from "lucide-react";
import Alert from "~/components/common/Alert";
import { useEffect, useState, useTransition } from "react";
import { Form, useActionData } from "@remix-run/react";
import { action } from "~/routes/dashboard._index";


type LoginType = {
  username: string;
  password: string;
};


export default function AddReviewModal({
  title,
  show,
  handleClose,
}: {
  title: string;
  show: boolean;
  handleClose: () => void;
}) {

  const actionData = useActionData<typeof action>();
  const transition = useTransition();
  const createReviewLoginAction = actionData &&
    typeof actionData === 'object' &&
    '_action' in actionData &&
    actionData._action === "createReviewLogin";

  const isSuccessful = actionData &&
    typeof actionData === 'object' &&
    'ok' in actionData &&
    actionData.ok;


  const [error, setError] = useState({
    missing: {
      id: "missing",
      show: false,
      msg: "Username or Password was not filled in",
    },
    other: {
      id: "other",
      show: false,
      msg: null,
    },
    review: {
      id: "review",
      show: false,
      msg: null,
    },
  });

  const [success, setSuccess] = useState({
    review: {
      show: false,
      msg: null,
    },
  });

  const [form, setForm] = useState<{ [key: string]: boolean }>({
    first: true,
    second: false,
    third: false,
  });

  const [credentials, setCredentials] = useState<LoginType>({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (
      isSuccessful && 
      actionData.ok && 
      createReviewLoginAction
    ) {
      setForm({
        first: false,
        second: false,
        third: true
      })
    }
  }, [isSuccessful, actionData]);


  const handleAlertClose = (id: string) => {
    // @ts-ignore
    setError((prevState: { [key: string]: any }) => {
      return {
        ...prevState,
        [id]: {
          ...prevState[id],
          show: false,
        },
      };
    });
  };

  useEffect(() => {
    setForm({
      first: true,
      second: false,
      third: false,
    });
    setError({
      missing: {
        id: "missing",
        show: false,
        msg: "Username or Password was not filled in",
      },
      other: {
        id: "other",
        show: false,
        msg: null,
      },
      review: {
        id: "review",
        show: false,
        msg: null,
      },
    });
  }, [show]);

  //  const handleLogin = async () => {
  //     try {
  //       let response = await fetch(api + "auth/login", {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(credentials)
  //     });    
  //     let data = await response.json();
  //       setForm({
  //         first: false,
  //         second: false,
  //         third: true,
  //       });
  //     } catch (error: any) {
  //       setError((prevState: any) => {
  //         return {
  //           ...prevState,
  //           other: {
  //             ...prevState.other,
  //             show: true,
  //             msg: "Could not log you in, please try again",
  //           },
  //         };
  //       });
  //     }
  //   };

  return (
    show && (
      <>
        <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
        <div className="fixed inset-0 flex items-center justify-center z-50 over-y-auto overflow-x-auto rounded">
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t bg-blue-700">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <button type="button" onClick={handleClose}>
                  <X size={24} className="text-white cursor-pointer rounded hover:opacity-75  duration-300" />
                </button>
              </div>
              {form.first && (
                <div className="p-6 space-y-6">
                  <p className="text-base leading-relaxed text-gray-500">
                    Please click the login button below to leave us review.
                  </p>
                  <div className="w-full flex justify-center items-center">
                    <button
                      type="button"
                      className="max-w-[300px] text-white bg-[#333533] hover:bg-[#202020] focus:ring-4 focus:outline-none
                                            font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                      onClick={() => {
                        setForm((prevState) => {
                          return { ...prevState, first: false, second: true };
                        });
                      }}
                    >
                      Login Here
                    </button>
                  </div>
                </div>
              )}
              {form.second && (
                <div className="p-6 space-y-6">
                  <Form className="space-y-6" method="POST">
                    <input type="hidden" name="_action" value="createReviewLogin" />
                    <div>
                      <label
                        htmlFor="username"
                        className="block mb-2 mt-3 text-sm font-medium text-gray-900"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        placeholder="Username"
                      />
                      <label
                        htmlFor="password"
                        className="block mb-2 mt-3 text-sm font-medium text-gray-900"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        placeholder="********"
                      />
                      <div className="mt-4">
                        <Alert
                          type="failure"
                          msg={error.missing.msg}
                          show={createReviewLoginAction && !isSuccessful}
                          id={error.missing.id}
                          handleClose={handleAlertClose}
                        />
                        <Alert
                          type="failure"
                          msg={error.other.msg}
                          show={createReviewLoginAction && !isSuccessful}
                          id={error.other.id}
                          handleClose={handleAlertClose}
                        />
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <button
                        type="submit"
                        className="max-w-[300px] text-white bg-[#333533] hover:bg-[#202020] focus:ring-4 focus:outline-none
                                           font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                      >
                        Login
                      </button>
                    </div>
                  </Form>
                </div>
              )}

              {form.third && (
                <div className="p-6 space-y-6">
                  <p className="text-base leading-relaxed text-gray-500">
                    Please fill us a review and fill out required fields. Note -
                    You have to be an active customer in order to leave us a
                    review.
                  </p>

                  <Form className="space-y-6" action="#">
                    <input type="hidden" name="_action" value="submitReview" />
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block mb-2 mt-3 text-sm font-medium text-gray-900"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        placeholder="Enter First Name"
                        v-model="review.first_name"
                      />
                      <label
                        htmlFor="last_name"
                        className="block mb-2 mt-3 text-sm font-medium text-gray-900"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        placeholder="Enter Last Name"
                      />
                      <label
                        htmlFor="rating"
                        className="block mb-2 mt-3 text-sm font-medium text-gray-900"
                      >
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="rating"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none"
                        required
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <label
                        htmlFor="message"
                        className="block mb-2 mt-3 text-sm font-medium text-gray-900"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        rows={5}
                        required
                        placeholder="Write us your feedback. :)"
                      ></textarea>
                      <div className="mt-4">
                        <Alert
                          type="failure"
                          msg={error.review.msg}
                          show={createReviewLoginAction && !isSuccessful}
                          id="review"
                          handleClose={handleAlertClose}
                        />
                        <Alert
                          type="success"
                          msg={success.review.msg}
                          show={createReviewLoginAction && !isSuccessful}
                          id="review"
                          handleClose={handleAlertClose}
                        />
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <button
                        type="button"
                        className="max-w-[300px] text-white bg-[#333533] hover:bg-[#202020] focus:ring-4 focus:outline-none
                                           font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </div>
              )}
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b"></div>
            </div>
          </div>
        </div>
      </>
    )
  );
}