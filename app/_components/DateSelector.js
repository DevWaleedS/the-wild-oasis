"use client";
import { useReservation } from "@/_context/ReservationsContext";
import {
	differenceInDays,
	isPast,
	isSameDay,
	isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function isAlreadyBooked(range, datesArr) {
	return (
		range.from &&
		range.to &&
		datesArr.some((date) =>
			isWithinInterval(date, { start: range.from, end: range.to }),
		)
	);
}

function DateSelector({ settings, cabin, bookedDates }) {
	const { range, setRange, resetRange } = useReservation();
	const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

	const { regularPrice, discount } = cabin;
	const { minBookingLength, maxBookingLength } = settings;
	const numNights = differenceInDays(range.to, range.from);
	const cabinPrice = numNights * (regularPrice - discount);

	return (
		<div className='flex flex-col justify-between rounded-sm overflow-hidden shadow-lg'>
			<div className='pt-8 pb-4 px-4 place-self-center [--rdp-cell-size:44px] [--rdp-accent-color:theme(colors.accent.500)] [--rdp-accent-color-dark:theme(colors.accent.600)] [--rdp-background-color:theme(colors.primary.800)] [--rdp-outline:2px_solid_theme(colors.accent.400)]'>
				<DayPicker
					mode='range'
					onSelect={setRange}
					selected={displayRange}
					min={minBookingLength + 1}
					max={maxBookingLength}
					fromMonth={new Date()}
					fromDate={new Date()}
					toYear={new Date().getFullYear() + 5}
					captionLayout='dropdown'
					numberOfMonths={2}
					disabled={(curDate) =>
						isPast(curDate) ||
						bookedDates.some((bookedDate) => isSameDay(bookedDate, curDate))
					}
					className='!bg-primary-800 !text-primary-100 rounded-t-sm'
					classNames={{
						months: "flex flex-col sm:flex-row gap-6",
						caption: "flex justify-center items-center h-10 mb-2",
						caption_label: "text-sm font-semibold text-primary-100",
						nav_button:
							"text-primary-300 hover:text-accent-400 transition-colors rounded-full h-8 w-8 flex items-center justify-center",
						table: "w-full border-collapse",
						head_cell: "text-primary-400 font-medium text-xs pb-2",
						cell: "text-center",
						day: "rounded-full h-10 w-10 text-sm font-medium text-primary-100 hover:bg-primary-700 transition-colors",
						day_selected:
							"!bg-accent-500 !text-primary-900 font-semibold hover:!bg-accent-500",
						day_range_middle: "!bg-accent-500/20 !text-accent-100 rounded-none",
						day_range_start: "!rounded-l-full",
						day_range_end: "!rounded-r-full",
						day_disabled: "text-primary-600 opacity-40 line-through",
						day_today: "border border-accent-400",
					}}
				/>
			</div>

			<div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-4 sm:py-0 bg-accent-500 text-primary-800 sm:h-[72px]'>
				<div className='flex flex-wrap items-baseline gap-4 sm:gap-6'>
					<p className='flex gap-2 items-baseline'>
						{discount > 0 ? (
							<>
								<span className='text-xl sm:text-2xl font-semibold'>
									${regularPrice - discount}
								</span>
								<span className='line-through font-semibold text-primary-700'>
									${regularPrice}
								</span>
							</>
						) : (
							<span className='text-xl sm:text-2xl font-semibold'>
								${regularPrice}
							</span>
						)}
						<span className='text-sm'>/night</span>
					</p>

					{numNights ? (
						<>
							<p className='bg-accent-600 rounded-sm px-3 py-2 text-lg sm:text-2xl text-primary-50'>
								<span>&times;</span> <span>{numNights}</span>
							</p>
							<p>
								<span className='text-sm sm:text-lg font-bold uppercase'>
									Total
								</span>{" "}
								<span className='text-xl sm:text-2xl font-semibold'>
									${cabinPrice}
								</span>
							</p>
						</>
					) : null}
				</div>

				{displayRange.from || displayRange.to ? (
					<button
						className='border border-primary-800 rounded-sm py-2 px-4 text-sm font-semibold hover:bg-primary-800 hover:text-accent-100 transition-colors'
						onClick={() => resetRange()}>
						Clear
					</button>
				) : null}
			</div>
		</div>
	);
}

export default DateSelector;
