import React from "react";
import { useBtmContext } from "../../src/BtmContext";
import { CategoryModalForm } from "../../src/components";
import swal from "sweetalert";

export default function Categories() {
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
  const categories = btmContext.categories;
  const handleDelete = async (id: number) => {
    const req = await swal({
      title: "Are you sure want to permanently delete this category?",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    });

    if (req) {
      await btmContext.deleteCategory(id);
      await swal("The Category has been deleted!", {
        icon: "success",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {toogle.add && (
        <CategoryModalForm setToogle={setToogle} title="Add" id={toogle.id} />
      )}
      {toogle.edit && (
        <CategoryModalForm setToogle={setToogle} title="Edit" id={toogle.id} />
      )}
      <div className="flex justify-between">
        <p className="font-bold text-3xl mb-6 ml-4">Categories</p>
        <button
          className="justify-center h-10 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setToogle({ add: true, edit: false, id: null })}
        >
          Add New Category
        </button>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {category.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-items-end">
                      <div className="flex justify-end w-full">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-1"
                          onClick={() =>
                            setToogle({
                              add: false,
                              edit: true,
                              id: category.id,
                            })
                          }
                        >
                          Edit
                        </button>
                        <p className="text-indigo-600">|</p>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 ml-1"
                          // onClick={() => btmContext.deleteCategory(category.id)}
                          onClick={async () => await handleDelete(category.id)}
                        >
                          Delete
                        </button>
                      </div>
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
