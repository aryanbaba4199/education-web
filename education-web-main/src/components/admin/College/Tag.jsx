import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import {
  collegeApi,
  getterFunction,
  posterFunction,
  updaterFunction,
  removerFunction,
} from "../../../Api";

const Tag = ({ handleClose }) => {
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ title: "", type: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    try {
      const res = await getterFunction(collegeApi.getTag);
      if (res.success) {
        setTags(res.data);
      }
    } catch (e) {
      console.error("Error fetching tags:", e);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.type) return;

    try {
      if (editIndex !== null) {
        const tagId = tags[editIndex]._id;
        const res = await updaterFunction(`${collegeApi.updateTag}/${tagId}`, form);
        if (res.success) {
          const updated = [...tags];
          updated[editIndex] = { ...updated[editIndex], ...form };
          setTags(updated);
          setEditIndex(null);
        }
      } else {
        const res = await posterFunction(collegeApi.createTag, form);
        if (res.success) {
          setTags([...tags, res.data]); // assuming backend returns saved tag
        }
      }
      setForm({ title: "", type: "" });
    } catch (e) {
      console.error("Error submitting tag:", e);
    }
  };

  const handleEdit = (index) => {
    setForm(tags[index]);
    setEditIndex(index);
  };

  const handleDelete = async (id, index) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This tag will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e40af",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await removerFunction(`${collegeApi.removeTag}/${id}`);
        if (res.success) {
          const updated = tags.filter((_, i) => i !== index);
          setTags(updated);
          Swal.fire("Deleted!", "The tag has been removed.", "success");
        }
      } catch (e) {
        console.error("Error deleting tag:", e);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Tags</h2>

      {/* Input Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tag Title"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <input
          type="text"
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Tag Type"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={handleClose}
            className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition"
          >
            {editIndex !== null ? "Update Tag" : "Create Tag"}
          </button>
        </div>
      </div>

      {/* Tag List */}
      {tags.length > 0 ? (
        <div className="space-y-4">
          {tags.map((tag, index) => (
            <div
              key={tag._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-start flex-wrap gap-2"
            >
              <div>
                <h3 className="text-lg font-semibold">{tag.title}</h3>
                <p className="text-gray-600 text-sm">Type: {tag.type}</p>
              </div>
              <div className="flex space-x-3 text-xl text-gray-600">
                <button onClick={() => handleEdit(index)} title="Edit">
                  <FiEdit className="hover:text-blue-600" />
                </button>
                <button onClick={() => handleDelete(tag._id, index)} title="Delete">
                  <FiTrash2 className="hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No tags added yet.</p>
      )}
    </div>
  );
};

export default Tag;
