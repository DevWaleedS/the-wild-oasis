"use client";
import { useReservation } from "@/_context/ReservationsContext";
import { createBooking } from "@/_lib/actions";
import SubmissionButton from "@/_components/SubmissionButton";
import Image from "next/image";
import { differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function ReservationForm({ cabin, user }) {
	const router = useRouter();
	const { range, resetRange } = useReservation();
	const { id, maxCapacity, regularPrice, discount } = cabin;

	const startDate = range.from;
	const endDate = range.to;
	const numNights = differenceInDays(endDate, startDate);
	const cabinPrice = numNights * (regularPrice - discount);

	const bookingData = {
		startDate,
		endDate,
		cabinId: id,
		cabinPrice,
		numNights,
	};

	const createBookingAction = createBooking.bind(null, bookingData);

	async function handleSubmit(formData) {
		const result = await createBookingAction(formData);

		if (result?.success === false) {
			toast.error(result.message);
			return;
		}

		toast.success("Booking created successfully!");
		resetRange();
		router.push(`/cabins/thankyou`);
	}

	return (
		<div className='scale-[1.01]'>
			<div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
				<p>Logged in as</p>

				<div className='flex gap-4 items-center'>
					<div className='relative inline-flex mr-2 -mb-1.5 w-8 h-8'>
						<Image
							fill
							referrerPolicy='no-referrer'
							className='object-cover rounded-full'
							src={user.image}
							alt={user.name}
						/>
					</div>
					<p>{user.name}</p>
				</div>
			</div>

			<form
				action={handleSubmit}
				className='bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col'>
				<div className='space-y-2'>
					<label htmlFor='numGuests'>How many guests?</label>
					<select
						name='numGuests'
						id='numGuests'
						className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
						required>
						<option value='' key=''>
							Select number of guests...
						</option>
						{Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
							<option value={x} key={x}>
								{x} {x === 1 ? "guest" : "guests"}
							</option>
						))}
					</select>
				</div>

				<div className='space-y-2'>
					<label htmlFor='observations'>
						Anything we should know about your stay?
					</label>
					<textarea
						name='observations'
						id='observations'
						className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
						placeholder='Any pets, allergies, special requirements, etc.?'
					/>
				</div>

				<div className='flex justify-end items-center gap-6'>
					{!startDate && !endDate ? (
						<p className='text-primary-300 text-base'>
							Start by selecting dates
						</p>
					) : (
						<SubmissionButton
							disabled={!startDate || !endDate}
							pendingLabel={"Reserving..."}>
							Reserving Now
						</SubmissionButton>
					)}
				</div>
			</form>
		</div>
	);
}

export default ReservationForm;
