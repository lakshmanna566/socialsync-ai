
import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface SchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export const Scheduler: React.FC<SchedulerProps> = ({ isOpen, onClose, value, onChange }) => {
  const [date, setDate] = useState<Date>(value || new Date());

  useEffect(() => {
    if(value) {
      setDate(value);
    } else {
      // Set to nearest upcoming 30-minute interval
      const now = new Date();
      const minutes = now.getMinutes();
      now.setSeconds(0);
      now.setMilliseconds(0);
      if (minutes < 30) {
        now.setMinutes(30);
      } else {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
      }
      setDate(now);
    }
  }, [value, isOpen]);

  if (!isOpen) return null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const [year, month, day] = [newDate.getFullYear(), newDate.getMonth(), newDate.getDate()];
    const updatedDate = new Date(date);
    updatedDate.setFullYear(year, month, day);
    setDate(updatedDate);
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const updatedDate = new Date(date);
    updatedDate.setHours(hours, minutes);
    setDate(updatedDate);
  };

  const handleConfirm = () => {
    onChange(date);
    onClose();
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 animate-slide-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Schedule Post</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
            <div className="relative">
                <label htmlFor="date" className="text-sm font-medium text-gray-400">Date</label>
                <div className="flex items-center mt-1">
                    <CalendarIcon className="h-5 w-5 text-gray-500 absolute left-3"/>
                    <input
                        id="date"
                        type="date"
                        value={date.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            <div className="relative">
                <label htmlFor="time" className="text-sm font-medium text-gray-400">Time</label>
                <div className="flex items-center mt-1">
                    <Clock className="h-5 w-5 text-gray-500 absolute left-3"/>
                    <input
                        id="time"
                        type="time"
                        value={date.toTimeString().substring(0, 5)}
                        onChange={handleTimeChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                Cancel
            </button>
            <button onClick={handleConfirm} className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors">
                Confirm Schedule
            </button>
        </div>
      </div>
    </div>
  );
};
