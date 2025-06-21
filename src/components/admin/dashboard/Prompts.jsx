import React, { useEffect, useState } from 'react';
import { getterFunction, posterFunction, removerFunction, updaterFunction } from '../../../Api';
import { collegeApi } from '../../../Api';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import Swal from 'sweetalert2';

const Prompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState({ id: '', title: '', prompt: '' });

  console.log(prompts)

  // Fetch prompts
  const getPrompts = async () => {
    try {
      const res = await getterFunction(collegeApi.getPrompts);
      console.log('data is ', res.data)
      if (res?.success) setPrompts(res.data.data);
    } catch (error) {
      console.error('Error in getting')
    }
  };

  useEffect(() => {
    getPrompts();
  }, []);

  // Open Modal
  const handleOpen = (prompt = { id: '', title: '', prompt: '' }) => {
    setEditMode(!!prompt.id);
    setCurrentPrompt(prompt);
    setOpen(true);
  };

  // Close Modal
  const handleClose = () => {
    setCurrentPrompt({ id: '', title: '', prompt: '' });
    setOpen(false);
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPrompt((prev) => ({ ...prev, [name]: value }));
  };

  // Save (Create / Update)
  const handleSave = async () => {
    const { id, title, prompt } = currentPrompt;
    if (!title.trim() || !prompt.trim()) return;

    if (editMode) {
      await updaterFunction(collegeApi.updatePrommts, { id, title, prompt });
    } else {
      await posterFunction(collegeApi.createPrompts, { title, prompt });
    }

    handleClose();
    getPrompts();
  };



  const handleDelete = async (id) => {
    // Step 1: Ask for Admin Code
    const { value: adminCode } = await Swal.fire({
      title: 'Enter Admin Code',
      input: 'password',
      inputLabel: 'Admin Code Required',
      inputPlaceholder: 'Enter admin code...',
      inputAttributes: {
        maxlength: 10,
        autocapitalize: 'off',
        autocorrect: 'off',
      },
      showCancelButton: true,
    });
  
    if (adminCode !== '727798') {
      if (adminCode) {
        Swal.fire('Error', 'Invalid admin code', 'error');
      }
      return;
    }
  
    // Step 2: Confirm Delete
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This prompt will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (confirm.isConfirmed) {
      await removerFunction(collegeApi.removePrompts, { id });
      Swal.fire('Deleted!', 'Prompt has been deleted.', 'success');
      getPrompts();
    }
  };
  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Prompts</h2>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '12px' }}
        >
          Add Prompt
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className=" text-sm">
          
   
            {prompts.length>0 && prompts.map((item, index) => (
              <div key={item._id} className="flex flex-col shadow-md shadow-black m-4">
                <p className="px-6 py-4 text-lg font-semibold">{index+1}. Function Name : {item.title}</p>
                <p className="px-6">{item.prompt}</p>
                <span className="px-6 py-4 text-right space-x-2">
                  <IconButton
                    onClick={() =>
                      handleOpen({ id: item._id, title: item.title, prompt: item.prompt })
                    }
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item._id)} color="error">
                    <FiTrash2 />
                  </IconButton>
                </span>
              </div>
            ))}
   
        </div>

        {prompts.length === 0 && (
          <div className="p-6 text-center text-gray-500">No prompts found.</div>
        )}
      </div>

      {/* Modal */}
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Prompt' : 'Create Prompt'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2  ">
          <TextField
            name="title"
            label="Title (Functionality)"
            type="text"
            fullWidth
            value={currentPrompt.title}
            onChange={handleChange}
            variant="outlined"
            
          />
          <TextField
            name="prompt"
            label="Prompt"
            type="text"
            fullWidth
            value={currentPrompt.prompt}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Prompts;
