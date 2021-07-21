import React from "react";
import Image from "next/image";
import { useBtmContext } from "../../src/BtmContext";
import { ModalForm } from "../components";
import swal from "sweetalert";

export default function Candidates() {
  const [toogle, setToogle] = React.useState<{
    add: boolean;
    edit: boolean;
    id: number | null;
  }>({
    add: false,
    edit: false,
    id: null,
  });
  const btmContext = useBtmContext();

  const candidates = btmContext.candidates;

  const handleDelete = async (id: number) => {
    const req = await swal({
      title: "Are you sure want to permanently delete this candidate?",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    });

    if (req) {
      await btmContext.deleteCandidate(id);
      await swal("The Candidate has been deleted!", {
        icon: "success",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {toogle.add && (
        <ModalForm setToogle={setToogle} title="Add" id={toogle.id} />
      )}
      {toogle.edit && (
        <ModalForm setToogle={setToogle} title="Edit" id={toogle.id} />
      )}
      <div className="flex justify-between">
        <p className="font-bold text-3xl mb-6 ml-4">Candidates</p>
        <button
          className="justify-center h-10 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() =>
            setToogle((prevToogle) => ({ ...prevToogle, add: true }))
          }
        >
          Add New Candidate
        </button>
      </div>
      <div className="-my-2 overflow-y-auto sm:-mx-6 lg:-mx-8 h-screen">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            src={`${candidate.image}`}
                            height={40}
                            width={40}
                            alt=""
                            className="rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 w-96 overflow-hidden truncate">
                        {candidate.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {candidate.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.job}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-1"
                        onClick={() =>
                          setToogle({
                            add: false,
                            edit: true,
                            id: candidate.id,
                          })
                        }
                      >
                        Edit
                      </button>
                      <p className="text-indigo-600">|</p>
                      <button
                        className="text-indigo-600 hover:text-indigo-900 ml-1"
                        onClick={async () => await handleDelete(candidate.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
