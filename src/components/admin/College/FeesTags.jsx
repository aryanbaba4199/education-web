import React, { useState, useEffect } from 'react';
import { collegeApi, getterFunction, posterFunction, updaterFunction, removerFunction } from '../../../Api';
import { FaPlus, FaEdit, FaTrash, FaCut } from 'react-icons/fa';
import { TextField, Button, IconButton, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import { IoClose } from "react-icons/io5";

const FeesTags = ({handleClose}) => {
  const [feesTags, setFeesTags] = useState([]);
  const [newTagTitle, setNewTagTitle] = useState('');
  const [editTag, setEditTag] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFeesTags();
  }, []);

  const getFeesTags = async () => {
    setLoading(true);
    try {
      const res = await getterFunction(collegeApi.getFeesTag);
      if (res.success) {
        setFeesTags(res.data);
      }
    } catch (e) {
      console.error('Error in getting tags:', e);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch fee tags.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagTitle.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Tag title cannot be empty.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }

    try {
      const res = await posterFunction(collegeApi.createFeesTag, { title: newTagTitle });
      if (res.success) {
        Swal.fire({
          title: 'Success',
          text: 'Fee tag created successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        setNewTagTitle('');
        getFeesTags(); // Refresh the list
      }
    } catch (e) {
      console.error('Error creating tag:', e);
      Swal.fire({
        title: 'Error',
        text: 'Failed to create fee tag.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const handleUpdateTag = async (tagId) => {
    if (!editTag?.title.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Tag title cannot be empty.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }

    try {
      const res = await updaterFunction(`${collegeApi.updateFeesTag}/${tagId}`, { title: editTag.title });
      if (res.success) {
        Swal.fire({
          title: 'Success',
          text: 'Fee tag updated successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        setEditTag(null);
        getFeesTags(); // Refresh the list
      }
    } catch (e) {
      console.error('Error updating tag:', e);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update fee tag.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const handleDeleteTag = async (tagId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await removerFunction(`${collegeApi.deleteFeesTag}/${tagId}`);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Fee tag has been deleted.',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
          getFeesTags(); // Refresh the list
        }
      } catch (e) {
        console.error('Error deleting tag:', e);
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete fee tag.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    }
  };

  const handleEditClick = (tag) => {
    setEditTag({ ...tag });
  };

  const handleEditChange = (e) => {
    setEditTag((prev) => ({ ...prev, title: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className='flex justify-center items-center'>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Fee Tags Management</h1>
        <IoClose onClick={handleClose} className='mb-6 ml-4 text-xl text-red-600 font-bold hover:cursor-pointer'/>
        </div>
        {/* Create Tag Form */}
        <form onSubmit={handleCreateTag} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <TextField
              label="Tag Title"
              variant="outlined"
              value={newTagTitle}
              onChange={(e) => setNewTagTitle(e.target.value)}
              fullWidth
              size="small"
              className="flex-1"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<FaPlus />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Tag
            </Button>
          </div>
        </form>

        {/* Tags List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Fee Tags</h2>
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : feesTags.length === 0 ? (
            <p className="text-gray-600 text-center">No fee tags available.</p>
          ) : (
            <ul className="space-y-4">
              {feesTags.map((tag) => (
                <li
                  key={tag._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                >
                  {editTag && editTag._id === tag._id ? (
                    <div className="flex items-center gap-4 w-full">
                      <TextField
                        value={editTag.title}
                        onChange={handleEditChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Button
                        onClick={() => handleUpdateTag(tag._id)}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditTag(null)}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-700">{tag.title}</span>
                      <div className="flex gap-2">
                        <IconButton
                          onClick={() => handleEditClick(tag)}
                          color="primary"
                          size="small"
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteTag(tag._id)}
                          color="error"
                          size="small"
                        >
                          <FaTrash />
                        </IconButton>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeesTags;