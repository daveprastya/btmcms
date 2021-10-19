import React from "react";
import { useBtmContext } from "../BtmContext";
import ReactS3Client from "react-aws-s3-typescript";
import swal from "sweetalert";

type CandidatesInput = {
  name: string;
  job: string;
  description: string;
  image: string;
  category: number;
};

const config = {
  bucketName: `${process.env.NEXT_PUBLIC_BUCKETNAME}`,
  region: `${process.env.NEXT_PUBLIC_REGION}`,
  accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEY}`,
  secretAccessKey: `${process.env.NEXT_PUBLIC_SECRET_ACCESSKEY}`,
};

export default function ModalForm(props: {
  setToogle: React.Dispatch<
    React.SetStateAction<{ add: boolean; edit: boolean; id: number | null }>
  >;
  title: string;
  id: number | null;
}) {
  const [state, setState] = React.useState<CandidatesInput>({
    name: "",
    job: "",
    description: "",
    image: "",
    category: 1,
  });

  const [file, setFile] = React.useState<File | null>(null);
  const btmContext = useBtmContext();

  React.useEffect(() => {
    const selectedData = btmContext.candidates.find(
      (candidate) => candidate.id === props.id
    );
    if (!selectedData) return;
    setState({
      name: selectedData.name,
      job: selectedData.job,
      description: selectedData.description,
      image: selectedData.image,
      category: selectedData.categoryId,
    });
  }, [props.id]);

  const s3Client = new ReactS3Client(config);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imgUrl = null;
    if (file) {
      imgUrl = await s3Client.uploadFile(file);
    }

    if (props.title === "Add") {
      if (imgUrl) {
        await btmContext.postCandidate({
          name: state.name,
          job: state.job,
          category: state.category,
          description: state.description,
          image: imgUrl.location,
        });
        await swal("The Candidate has been added!", {
          icon: "success",
        });
      }
    } else if (props.title === "Edit") {
      if (!props.id) return;
      await btmContext.editCandidate(
        {
          name: state.name,
          job: state.job,
          category: state.category,
          description: state.description,
          image: imgUrl ? imgUrl.location : state.image,
        },
        props.id
      );
      await swal("The Candidate has been edited!", {
        icon: "success",
      });
    }

    await props.setToogle({ add: false, edit: false, id: null });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 antialiased w-screen h-full overflow-y-auto">
      <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl mt-auto">
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
            <p className="mb-2 font-semibold text-gray-700">Name</p>
            <input
              type="text"
              name="name"
              className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm"
              placeholder="Input Name.."
              value={state.name}
              required
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <p className="mb-2 font-semibold text-gray-700">Description</p>
            <textarea
              name="description"
              placeholder="Type description..."
              className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-24"
              required
              value={state.description}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
            ></textarea>
            <p className="mb-2 font-semibold text-gray-700">Category</p>
            <select
              name="categorySelect"
              className="mb-5"
              value={state.category}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  category: Number(e.target.value),
                }))
              }
            >
              {btmContext.categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            <p className="mb-2 font-semibold text-gray-700">Job</p>
            <input
              type="text"
              name="job"
              className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm"
              placeholder="Input Job.."
              required
              value={state.job}
              onChange={(e) =>
                setState((prevState) => ({ ...prevState, job: e.target.value }))
              }
            />
            <p className="mb-2 font-semibold text-gray-700">Image</p>
            <label className="w-48 flex flex-col items-center px-4 py-1 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-600 hover:text-white text-purple-600 ease-linear transition-all duration-150 overflow-hidden">
              <i className="fas fa-cloud-upload-alt fa-3x" />
              <span className="mt-2 text-base leading-normal overflow-hidden truncate">
                {file ? file.name : "Select a file"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                name="file"
              />
            </label>
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
