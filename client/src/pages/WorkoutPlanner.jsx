import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Full Body Workout',
      date: '2024-03-20',
      color: '#ff2625'
    },
    {
      id: '2',
      title: 'Upper Body Focus',
      date: '2024-03-22',
      color: '#ff2625'
    }
  ]);

  const [newWorkout, setNewWorkout] = useState({
    title: '',
    exercises: [],
    duration: ''
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(workouts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkouts(items);
  };

  const handleDateClick = (arg) => {
    const selectedWorkout = workouts[0];
    if (selectedWorkout) {
      const newEvent = {
        id: Date.now().toString(),
        title: selectedWorkout.title,
        date: arg.dateStr,
        color: '#ff2625'
      };
      setEvents([...events, newEvent]);
      toast.success('Workout scheduled successfully!');
    }
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (newWorkout.title && newWorkout.duration) {
      setWorkouts([
        ...workouts,
        {
          id: Date.now().toString(),
          ...newWorkout
        }
      ]);
      setNewWorkout({ title: '', exercises: [], duration: '' });
      toast.success('New workout added!');
    }
  };

  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
    setEvents(events.filter(event => event.title !== workouts.find(w => w.id === id)?.title));
    toast.success('Workout deleted!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workout List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Workout Templates</h2>
              <button
                onClick={() => document.getElementById('addWorkoutForm').scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" /> Add Workout
              </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="workouts">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {workouts.map((workout, index) => (
                      <Draggable
                        key={workout.id}
                        draggableId={workout.id}
                        index={index}
                      >
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
                                <p className="text-gray-600 text-sm">{workout.duration}</p>
                                <ul className="mt-2 space-y-1">
                                  {workout.exercises.map((exercise, i) => (
                                    <li key={i} className="text-sm flex items-center">
                                      <FaDumbbell className="text-primary mr-2" />
                                      {exercise}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <button
                                onClick={() => handleDeleteWorkout(workout.id)}
                                className="text-red-500 hover:text-red-600"
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

            <form id="addWorkoutForm" onSubmit={handleAddWorkout} className="mt-8 space-y-4">
              <h3 className="font-semibold">Add New Workout</h3>
              <input
                type="text"
                placeholder="Workout Title"
                value={newWorkout.title}
                onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 45 min)"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Add Workout
              </button>
            </form>
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
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
              editable={true}
              selectable={true}
              eventColor="#ff2625"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanner;