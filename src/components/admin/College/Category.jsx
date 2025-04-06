import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import {
  collegeApi,
  getterFunction,
  posterFunction,
  removerFunction,
  updaterFunction,
} from "../../../Api";

const Category = ({ handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const res = await getterFunction(collegeApi.getCategory);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (e) {
      console.error("Error in fetching categories:", e);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;

    try {
      if (editIndex !== null && editId) {
        const res = await updaterFunction(
          `${collegeApi.updateCategory}/${editId}`,
          form
        );
        if (res.success) {
          const updated = [...categories];
          updated[editIndex] = { ...form, _id: editId };
          setCategories(updated);
          setEditIndex(null);
          setEditId(null);
          Swal.fire("Updated!", "Category updated successfully.", "success");
        }
      } else {
        const res = await posterFunction(collegeApi.createCategory, form);
        if (res.success) {
          setCategories([...categories, res.data]);
          Swal.fire("Created!", "Category added successfully.", "success");
        }
      }
    } catch (e) {
      console.error("Error in submitting form:", e);
      Swal.fire("Error!", "Something went wrong.", "error");
    }

    setForm({ title: "", description: "" });
  };

  const handleEdit = (index, id) => {
    setForm({
      title: categories[index].title,
      description: categories[index].description,
    });
    setEditIndex(index);
    setEditId(id);
  };

  const handleDelete = async (index, id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await removerFunction(`${collegeApi.removeCategory}/${id}`);
        if (res.success) {
          const updated = categories.filter((_, i) => i !== index);
          setCategories(updated);
          Swal.fire("Deleted!", "Category has been removed.", "success");
        } else {
          Swal.fire("Oops!", "Failed to delete category.", "error");
        }
      } catch (e) {
        console.error("Error deleting category:", e);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {/* Input Fields */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Category Title"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Category Description"
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
            {editIndex !== null ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>

      {/* Category List */}
      {categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div
              key={cat._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-start flex-wrap gap-2"
            >
              <div>
                <h3 className="text-lg font-semibold">{cat.title}</h3>
                <p className="text-gray-600">{cat.description}</p>
              </div>
              <div className="flex space-x-3 text-xl text-gray-600">
                <button onClick={() => handleEdit(index, cat._id)} title="Edit">
                  <FiEdit className="hover:text-blue-600" />
                </button>
                <button onClick={() => handleDelete(index, cat._id)} title="Delete">
                  <FiTrash2 className="hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No categories added yet.</p>
      )}
    </div>
  );
};

export default Category;
