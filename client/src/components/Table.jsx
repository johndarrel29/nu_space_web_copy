import React from "react";

function Table() {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2 border">Song</th>
            <th className="px-4 py-2 border">Artist</th>
            <th className="px-4 py-2 border">Year</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition">
            <td className="px-4 py-2 border">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td className="px-4 py-2 border">Malcolm Lockyer</td>
            <td className="px-4 py-2 border">1961</td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition">
            <td className="px-4 py-2 border">Witchy Woman</td>
            <td className="px-4 py-2 border">The Eagles</td>
            <td className="px-4 py-2 border">1972</td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition">
            <td className="px-4 py-2 border">Shining Star</td>
            <td className="px-4 py-2 border">Earth, Wind, and Fire</td>
            <td className="px-4 py-2 border">1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
