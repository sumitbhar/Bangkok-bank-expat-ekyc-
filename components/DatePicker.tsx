import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CalendarIcon } from './icons/CalendarIcon';

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to parse YYYY-MM-DD string to a UTC Date object
const parseDate = (dateString: string): Date | null => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;
    const parts = dateString.split('-').map(s => parseInt(s, 10));
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
};


interface DatePickerProps {
    id: string;
    selectedDate: string;
    onChange: (date: string) => void;
    minDate?: Date;
    maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ id, selectedDate, onChange, minDate, maxDate }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Use UTC for viewDate to prevent timezone shifts
    const [viewDate, setViewDate] = useState(parseDate(selectedDate) || new Date(new Date().setUTCHours(0, 0, 0, 0)));
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    useEffect(() => {
        const newSelDate = parseDate(selectedDate);
        if (newSelDate) {
            setViewDate(new Date(Date.UTC(newSelDate.getUTCFullYear(), newSelDate.getUTCMonth(), 1)));
        }
    }, [selectedDate]);

    const handleDateSelect = (date: Date) => {
        onChange(formatDate(date));
        setIsOpen(false);
    };

    const changeMonth = (amount: number) => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setUTCMonth(newDate.getUTCMonth() + amount);
            return newDate;
        });
    };

    const calendarDays = useMemo(() => {
        const days: Date[] = [];
        const year = viewDate.getUTCFullYear();
        const month = viewDate.getUTCMonth();
        
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
        const startDate = new Date(firstDayOfMonth);
        startDate.setUTCDate(startDate.getUTCDate() - firstDayOfMonth.getUTCDay());

        for (let i = 0; i < 42; i++) {
            days.push(new Date(startDate));
            startDate.setUTCDate(startDate.getUTCDate() + 1);
        }
        return days;
    }, [viewDate]);

    const selectedDateObj = parseDate(selectedDate);
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    
    // Ensure min/max dates are compared at UTC midnight
    const minDateUTC = minDate ? new Date(Date.UTC(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) : null;
    const maxDateUTC = maxDate ? new Date(Date.UTC(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) : null;

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    value={selectedDate}
                    onFocus={() => setIsOpen(true)}
                    readOnly
                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-[--color-background-main] border border-[--color-border] rounded-md shadow-sm focus:outline-none focus:ring-[--color-focus-ring] focus:border-[--color-primary] cursor-pointer"
                    aria-label="Date picker input"
                />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[--color-background-main] border border-[--color-border] rounded-md shadow-lg p-2" role="dialog" aria-modal="true">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-[--color-surface] focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring]" aria-label="Previous month">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="font-semibold text-sm">
                           {viewDate.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                        </span>
                        <button type="button" onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-[--color-surface] focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring]" aria-label="Next month">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-7 text-center text-sm">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="font-medium text-[--color-text-muted] py-1">{day}</div>)}
                        {calendarDays.map((date, index) => {
                            const isCurrentMonth = date.getUTCMonth() === viewDate.getUTCMonth();
                            const isSelected = selectedDateObj && date.getTime() === selectedDateObj.getTime();
                            const isToday = todayUTC.getTime() === date.getTime();
                            // Bug Fix: Use `>` for maxDate to allow selection of the maxDate itself.
                            const isDisabled = (minDateUTC && date < minDateUTC) || (maxDateUTC && date > maxDateUTC);

                            let className = "flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-150";
                             if (!isCurrentMonth) {
                                className += " text-gray-300 cursor-default";
                            } else if (isDisabled) {
                                className += " text-gray-400 cursor-not-allowed";
                            }
                            else {
                                className += " cursor-pointer";
                                if (isSelected) {
                                    className += " bg-[--color-primary] text-[--color-primary-text] font-bold";
                                } else if (isToday) {
                                    className += " bg-[--color-primary-light] text-[--color-primary]";
                                } else {
                                    className += " hover:bg-[--color-surface]";
                                }
                            }
                            
                            return (
                                <button type="button" key={index} className={className} disabled={isDisabled || !isCurrentMonth} onClick={() => handleDateSelect(date)} aria-label={`Select date ${date.getUTCDate()}`}>
                                    {date.getUTCDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
