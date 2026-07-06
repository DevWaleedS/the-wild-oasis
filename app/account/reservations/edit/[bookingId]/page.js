import { getBooking, getCabin } from "@/_lib/data-service";
import UpdateReservationForm from "@/_components/UpdateReservationForm";

export default async function Page({ params }) {
	const { bookingId } = await params;
	const { numGuests, observations, cabinId } = await getBooking(bookingId);
	const { maxCapacity } = await getCabin(cabinId);

	return (
		<div>
			<h2 className='font-semibold text-2xl text-accent-400 mb-7'>
				Edit Reservation #{bookingId}
			</h2>

			<UpdateReservationForm
				bookingId={bookingId}
				numGuests={numGuests}
				maxCapacity={maxCapacity}
				observations={observations}
			/>
		</div>
	);
}
