import React from "react";
import { useBtmContext } from "../BtmContext";
import swal from "sweetalert";

export default function CategoryModalForms(props: {
  setToogle: React.Dispatch<
    React.SetStateAction<{ add: boolean; edit: boolean; id: number | null }>
  >;
  title: string;
  id: number | null;
}) {
  const [state, setState] = React.useState<string>("");
  const btmContext = useBtmContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.title === "Add") {
      await btmContext.addCategory(state);
      await swal("The Category has been added!", {
        icon: "success",
      });
    } else if (props.title === "Edit") {
      if (!props.id) return;
      await btmContext.editCategory(state, props.id);
      await swal("The Category has been edited!", {
        icon: "success",
      });
    }

    await props.setToogle({ add: false, edit: false, id: null });
  };

  React.useEffect(() => {
    const selectedCategory = btmContext.categories.find(
      (category) => category.id === props.id
    );
    if (!selectedCategory) return;
    setState(selectedCategory.title);
  }, [props.id]);

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 antialiased w-screen h-screen">
      <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
        <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
          <p className="font-bold text-gray-800 text-2xl">
            {props.title} Candidate
          </p>
          <button
            onClick={() =>
              props.setToogle({ add: false, edit: false, id: null })
            }
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <form action="" onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col px-6 py-5 bg-gray-50">
            <p className="mb-2 font-semibold text-gray-700">Category</p>
            <input
              type="text"
              name="name"
              className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm"
              placeholder="Input Category Title.."
              value={state}
              required
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
            <button
              className="font-semibold text-gray-600"
              onClick={() =>
                props.setToogle({ add: false, edit: false, id: null })
              }
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white font-semibold bg-blue-500 rounded"
              type="submit"
            >
              {props.title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
