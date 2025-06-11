import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaDumbbell, FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WorkoutPlanner = () => {
  const [workouts, setWorkouts] = useState([
    {
      id: '1',
      title: 'Full Body Workout',
      exercises: ['Squats', 'Bench Press', 'Deadlifts'],
      duration: '60 min'
    },
    {
      id: '2',
      title: 'Upper Body Focus',
      exercises: ['Push-ups', 'Pull-ups', 'Shoulder Press'],
      duration: '45 min'
    },
    {
      id: '3',
      title: 'Cardio Session',
      exercises: ['Running', 'Jump Rope', 'Burpees'],
      duration: '30 min'
    }
  ]);

  const [events, setEvents] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ title: '', exercises: '', duration: '' });
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updated = [...workouts];
    const [reorderedItem] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, reorderedItem);
    setWorkouts(updated);
  };

  const handleDateClick = (arg) => {
    const workout = workouts.find(w => w.id === selectedWorkoutId);
    if (!workout) return toast.error('Select a workout first!');
    const newEvent = {
      id: Date.now().toString(),
      title: workout.title,
      date: arg.dateStr,
      color: '#ff2625'
    };
    setEvents(prev => [...prev, newEvent]);
    toast.success('Workout scheduled!');
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.title || !newWorkout.duration || !newWorkout.exercises) {
      return toast.error('Fill all fields');
    }

    const newW = {
      id: Date.now().toString(),
      title: newWorkout.title,
      exercises: newWorkout.exercises.split(',').map(e => e.trim()),
      duration: newWorkout.duration
    };

    setWorkouts(prev => [...prev, newW]);
    setNewWorkout({ title: '', exercises: '', duration: '' });
    toast.success('Workout added!');
  };

  const handleDeleteWorkout = (id) => {
    const toDelete = workouts.find(w => w.id === id);
    setWorkouts(prev => prev.filter(w => w.id !== id));
    setEvents(prev => prev.filter(e => e.title !== toDelete.title));
    toast.success('Workout deleted!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workout List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Workouts</h2>
            <button
              onClick={() => document.getElementById('addWorkoutForm').scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Add
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="workouts">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                  {workouts.map((workout, index) => (
                    <Draggable key={workout.id} draggableId={workout.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{workout.title}</h3>
                              <p className="text-sm text-gray-500">{workout.duration}</p>
                              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {workout.exercises.map((exercise, i) => (
                                  <li key={i} className="flex items-center">
                                    <FaDumbbell className="text-primary mr-2" />
                                    {exercise}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => handleDeleteWorkout(workout.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add Workout Form */}
          <form
            id="addWorkoutForm"
            onSubmit={handleAddWorkout}
            className="mt-6 space-y-3 border-t pt-4"
          >
            <h3 className="font-semibold">Add New Workout</h3>
            <input
              type="text"
              placeholder="Workout Title"
              value={newWorkout.title}
              onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Exercises (comma separated)"
              value={newWorkout.exercises}
              onChange={(e) => setNewWorkout({ ...newWorkout, exercises: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 45 min)"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-red-600 transition"
            >
              Add Workout
            </button>
          </form>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Select Workout to Schedule</label>
              <select
                className="w-full border px-4 py-2 rounded"
                value={selectedWorkoutId}
                onChange={(e) => setSelectedWorkoutId(e.target.value)}
              >
                <option value="">-- Select Workout --</option>
                {workouts.map(workout => (
                  <option key={workout.id} value={workout.id}>
                    {workout.title}
                  </option>
                ))}
              </select>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
              }}
              height="auto"
              selectable={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanner;
