import React, { useEffect, useState } from 'react';

interface Workout {
  id?: number;
  name: string;
  type: string;
  sets: number;
  reps: number;
  muscle_group: string;
  goal: string;
  level: string;
  equipment: string;
  instructions: string;
  img?: string;
}

const emptyWorkout: Workout = {
  name: '',
  type: '',
  sets: 0,
  reps: 0,
  muscle_group: '',
  goal: '',
  level: '',
  equipment: '',
  instructions: '',
  img: '',
};

const WorkoutManagement: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Workout>(emptyWorkout);
  const [editId, setEditId] = useState<number|null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number|null>(null);

  const fetchWorkouts = () => {
    setLoading(true);
    fetch('/api/workouts')
      .then(res => res.json())
      .then(data => {
        setWorkouts(data.workouts || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load workouts');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setFormData(emptyWorkout);
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (w: Workout) => {
    setFormData(w);
    setEditId(w.id!);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDelete(id);
  };

  const confirmDeleteWorkout = () => {
    if (confirmDelete) {
      fetch(`/api/workouts/${confirmDelete}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          setConfirmDelete(null);
          fetchWorkouts();
        });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      fetch(`/api/workouts/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(() => {
          setShowForm(false);
          fetchWorkouts();
        });
    } else {
      fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(() => {
          setShowForm(false);
          fetchWorkouts();
        });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Workout Management</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Sets</th>
              <th className="p-2">Reps</th>
              <th className="p-2">Muscle Group</th>
              <th className="p-2">Goal</th>
              <th className="p-2">Level</th>
              <th className="p-2">Equipment</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map(w => (
              <tr key={w.id} className="border-b">
                <td className="p-2">{w.name}</td>
                <td className="p-2">{w.type}</td>
                <td className="p-2">{w.sets}</td>
                <td className="p-2">{w.reps}</td>
                <td className="p-2">{w.muscle_group}</td>
                <td className="p-2">{w.goal}</td>
                <td className="p-2">{w.level}</td>
                <td className="p-2">{w.equipment}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(w)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(w.id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleAdd}>Add Workout</button>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg" onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit' : 'Add'} Workout</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleInput} placeholder="Name" className="border p-2 rounded" required />
              <input name="type" value={formData.type} onChange={handleInput} placeholder="Type" className="border p-2 rounded" required />
              <input name="sets" value={formData.sets} onChange={handleInput} placeholder="Sets" type="number" className="border p-2 rounded" required />
              <input name="reps" value={formData.reps} onChange={handleInput} placeholder="Reps" type="number" className="border p-2 rounded" required />
              <input name="muscle_group" value={formData.muscle_group} onChange={handleInput} placeholder="Muscle Group" className="border p-2 rounded" required />
              <input name="goal" value={formData.goal} onChange={handleInput} placeholder="Goal" className="border p-2 rounded" required />
              <input name="level" value={formData.level} onChange={handleInput} placeholder="Level" className="border p-2 rounded" required />
              <input name="equipment" value={formData.equipment} onChange={handleInput} placeholder="Equipment" className="border p-2 rounded" required />
              <input name="img" value={formData.img} onChange={handleInput} placeholder="Image URL (optional)" className="border p-2 rounded col-span-2" />
              <textarea name="instructions" value={formData.instructions} onChange={handleInput} placeholder="Instructions" className="border p-2 rounded col-span-2" required />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editId ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this workout?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button className="px-4 py-2 rounded bg-gray-300" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={confirmDeleteWorkout}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutManagement; 