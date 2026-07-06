"use client";
import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "@/_lib/actions";
import toast from "react-hot-toast";

const ReservationsList = ({ bookings }) => {
	const [optimisticBookings, setOptimistic] = useOptimistic(
		bookings,
		(currentBookings, bookingId) => {
			// Optimistically update the state with the new booking
			return currentBookings.filter((booking) => booking.id !== bookingId);
		},
	);

	async function handleDelete(bookingId) {
		setOptimistic(bookingId);
		const result = await deleteBooking(bookingId);
		if (result?.success === false) {
			toast.error(result.message);
			return;
		}

		toast.success("Reservation deleted successfully!");
	}

	return (
		<ul className='space-y-6'>
			{optimisticBookings.map((booking) => (
				<ReservationCard
					onDelete={handleDelete}
					booking={booking}
					key={booking.id}
				/>
			))}
		</ul>
	);
};

export default ReservationsList;
