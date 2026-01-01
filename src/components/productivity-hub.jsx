import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, Trash2, Plus, X, Clock, Flag, GripVertical, TrendingUp, Link2, Download } from 'lucide-react';

const CalendarPlanner = () => {
  const [todos, setTodos] = useState([]);
  const [habits, setHabits] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState('calendar');
  const [draggedTodo, setDraggedTodo] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [modalInput, setModalInput] = useState({ title: '', url: '' });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('productivityHub_todos');
    const savedHabits = localStorage.getItem('productivityHub_habits');
    const savedResources = localStorage.getItem('productivityHub_resources');

    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Error loading todos from localStorage:', e);
      }
    }

    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error('Error loading habits from localStorage:', e);
      }
    }

    if (savedResources) {
      try {
        setResources(JSON.parse(savedResources));
      } catch (e) {
        console.error('Error loading resources from localStorage:', e);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productivityHub_todos', JSON.stringify(todos));
  }, [todos]);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productivityHub_habits', JSON.stringify(habits));
  }, [habits]);

  // Save resources to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productivityHub_resources', JSON.stringify(resources));
  }, [resources]);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install button
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    console.log('Is app installed (standalone mode)?', isStandalone);

    if (isStandalone) {
      console.log('App is already installed');
      setShowInstallPrompt(false);
    } else {
      // Show prompt button for testing/demo purposes after 2 seconds if event hasn't fired
      const timeout = setTimeout(() => {
        if (!deferredPrompt) {
          console.log('beforeinstallprompt not fired yet, showing button anyway for demo');
          setShowInstallPrompt(true);
        }
      }, 2000);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available. This happens when:');
      console.log('1. App is already installed');
      console.log('2. Browser doesn\'t support PWA installation');
      console.log('3. PWA criteria not met (needs HTTPS, manifest, service worker)');
      alert('Installation is not available right now. Make sure you\'re:\n\n1. Using a supported browser (Chrome, Edge, Safari)\n2. Not already installed\n3. Accessing via HTTPS or localhost');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt so it can't be used again
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const getDaysInMonth = (date) => {
    const year = parseInt(date.split('-')[0]);
    const month = parseInt(date.split('-')[1]) - 1;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTodosForDate = (date) => {
    return todos.filter(t => t.date === date);
  };

  const openModal = (type) => {
    setShowModal(type);
    setModalInput({ title: '', url: '' });
  };

  const closeModal = () => {
    setShowModal(null);
    setModalInput({ title: '', url: '' });
  };

  const addTodo = () => {
    if (!modalInput.title.trim()) return;
    const newTodo = {
      id: Date.now(),
      title: modalInput.title,
      date: selectedDate,
      completed: false,
      priority: 'medium',
      startTime: '09:00',
      duration: 60
    };
    setTodos([...todos, newTodo]);
    closeModal();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addHabit = () => {
    if (!modalInput.title.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: modalInput.title,
      completedDates: []
    };
    setHabits([...habits, newHabit]);
    closeModal();
  };

  const toggleHabitToday = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const completedDates = h.completedDates.includes(today)
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today];
        return { ...h, completedDates };
      }
      return h;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addResource = () => {
    if (!modalInput.url.trim()) return;
    const title = modalInput.title.trim() || 'Untitled Resource';
    const newResource = {
      id: Date.now(),
      title,
      url: modalInput.url,
      type: modalInput.url.includes('youtube') || modalInput.url.includes('youtu.be') ? 'video' : 'course',
      completed: false,
      addedAt: new Date().toISOString()
    };
    setResources([...resources, newResource]);
    closeModal();
  };

  const toggleResource = (id) => {
    setResources(resources.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteResource = (id) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleDragStart = (todo) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (date) => {
    if (draggedTodo) {
      updateTodo(draggedTodo.id, { date });
      setDraggedTodo(null);
    }
  };

  const priorityColors = {
    high: 'bg-red-100 border-red-500 text-red-900',
    medium: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    low: 'bg-green-100 border-green-500 text-green-900'
  };

  const CalendarView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const changeMonth = (delta) => {
      const date = new Date(selectedDate);
      date.setMonth(date.getMonth() + delta);
      setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{monthNames[month]} {year}</h2>
          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              ← Previous
            </button>
            <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>
          ))}

          {[...Array(startingDayOfWeek)].map((_, i) => (
            <div key={`empty-${i}`} className="min-h-32 bg-gray-50 rounded"></div>
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTodos = getTodosForDate(dateStr);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(dateStr)}
                className={`min-h-32 p-2 border-2 rounded cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' :
                  isToday ? 'border-green-500 bg-green-50' :
                    'border-gray-200 hover:border-gray-400'
                  }`}
              >
                <div className="font-bold text-gray-800 mb-1">{day}</div>
                <div className="space-y-1">
                  {dayTodos.slice(0, 3).map(todo => (
                    <div
                      key={todo.id}
                      draggable
                      onDragStart={() => handleDragStart(todo)}
                      className={`text-xs p-1 rounded border-l-2 cursor-move ${priorityColors[todo.priority]} ${todo.completed ? 'opacity-50 line-through' : ''
                        }`}
                      title={todo.title}
                    >
                      <div className="truncate">{todo.title}</div>
                    </div>
                  ))}
                  {dayTodos.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayTodos.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const DayView = () => {
    const dayTodos = getTodosForDate(selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{formatDate(selectedDate)}</h2>
          <button onClick={() => openModal('todo')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Plus size={20} /> Add Todo
          </button>
        </div>

        <div className="space-y-3">
          {dayTodos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No todos for this day. Click "Add Todo" to create one!</p>
          ) : (
            dayTodos.map(todo => (
              <div
                key={todo.id}
                draggable
                onDragStart={() => handleDragStart(todo)}
                className={`p-4 rounded-lg border-l-4 ${priorityColors[todo.priority]} ${todo.completed ? 'opacity-60' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="cursor-move text-gray-400 mt-1" size={20} />
                  <button onClick={() => toggleTodo(todo.id)} className="mt-1">
                    {todo.completed ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className={`font-semibold text-lg ${todo.completed ? 'line-through' : ''}`}>
                      {todo.title}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <input
                          type="time"
                          value={todo.startTime}
                          onChange={(e) => updateTodo(todo.id, { startTime: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="number"
                          value={todo.duration}
                          onChange={(e) => updateTodo(todo.id, { duration: parseInt(e.target.value) })}
                          className="border rounded px-2 py-1 w-16"
                          min="15"
                          step="15"
                        />
                        <span>min</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Flag size={16} />
                        <select
                          value={todo.priority}
                          onChange={(e) => updateTodo(todo.id, { priority: e.target.value })}
                          className="border rounded px-2 py-1"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700 mt-1">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const HabitsView = () => {
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Habit Tracker</h2>
          <button onClick={() => openModal('habit')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Plus size={20} /> Add Habit
          </button>
        </div>

        <div className="space-y-4">
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No habits tracked yet. Start building good habits!</p>
          ) : (
            habits.map(habit => {
              const isCompletedToday = habit.completedDates.includes(today);
              const streak = habit.completedDates.length;

              return (
                <div key={habit.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleHabitToday(habit.id)}
                        className={`p-2 rounded-lg border-2 transition-all ${isCompletedToday ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300 hover:border-green-500'
                          }`}
                      >
                        {isCompletedToday ? <CheckCircle className="text-white" size={24} /> : <Circle size={24} />}
                      </button>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <TrendingUp size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-600">{streak} days tracked</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => deleteHabit(habit.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const ResourcesView = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Learning Resources</h2>
          <button onClick={() => openModal('resource')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Plus size={20} /> Add Resource
          </button>
        </div>

        <div className="space-y-3">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No resources yet. Add YouTube videos or course links!</p>
          ) : (
            resources.map(resource => (
              <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleResource(resource.id)} className="mt-1">
                    {resource.completed ? <CheckCircle className="text-green-600" size={24} /> : <Circle size={24} />}
                  </button>

                  <div className="flex-1">
                    <h3 className={`font-semibold text-gray-800 ${resource.completed ? 'line-through' : ''}`}>
                      {resource.title}
                    </h3>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1 break-all"
                    >
                      <Link2 size={14} />
                      {resource.url}
                    </a>
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      {resource.type === 'video' ? '📹 Video' : '📚 Course'}
                    </span>
                  </div>

                  <button onClick={() => deleteResource(resource.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const InstallPrompt = () => {
    if (!showInstallPrompt) return null;

    return (
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-blue-500 animate-bounce">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <Download className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Install App</h3>
              <p className="text-sm text-gray-600 mb-3">
                Install this app on your device for a better experience!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Productivity Hub</h1>
          <p className="text-gray-600">Plan your day, track habits, and manage learning resources</p>
        </header>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
          >
            <Calendar size={20} /> Calendar View
          </button>
          <button
            onClick={() => setView('day')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
          >
            <Clock size={20} /> Day Plan
          </button>
          <button
            onClick={() => setView('habits')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'habits' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
          >
            <TrendingUp size={20} /> Habits
          </button>
          <button
            onClick={() => setView('resources')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'resources' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
          >
            <Link2 size={20} /> Resources
          </button>
        </div>

        {view === 'calendar' && <CalendarView />}
        {view === 'day' && <DayView />}
        {view === 'habits' && <HabitsView />}
        {view === 'resources' && <ResourcesView />}
        <InstallPrompt />

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {showModal === 'todo' && 'Add New Todo'}
                  {showModal === 'habit' && 'Add New Habit'}
                  {showModal === 'resource' && 'Add Learning Resource'}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {showModal === 'todo' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Todo Title</label>
                  <input
                    type="text"
                    value={modalInput.title}
                    onChange={(e) => setModalInput({ ...modalInput, title: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter todo title..."
                    autoFocus
                  />
                </div>
              )}

              {showModal === 'habit' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                  <input
                    type="text"
                    value={modalInput.title}
                    onChange={(e) => setModalInput({ ...modalInput, title: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Study for 1 hour"
                    autoFocus
                  />
                </div>
              )}

              {showModal === 'resource' && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL</label>
                    <input
                      type="url"
                      value={modalInput.url}
                      onChange={(e) => setModalInput({ ...modalInput, url: e.target.value })}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/watch?v=..."
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                    <input
                      type="text"
                      value={modalInput.title}
                      onChange={(e) => setModalInput({ ...modalInput, title: e.target.value })}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Resource title..."
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (showModal === 'todo') addTodo();
                    else if (showModal === 'habit') addHabit();
                    else if (showModal === 'resource') addResource();
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPlanner;