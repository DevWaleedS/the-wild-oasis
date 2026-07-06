import {
	getBookedDatesByCabinId,
	getCabin,
	getSettings,
} from "@/_lib/data-service";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import LoginMessage from "./LoginMessage";
import { auth } from "@/_lib/auth";

async function Reservation({ cabinId }) {
	const session = await auth();
	const cabin = await getCabin(cabinId);
	const [settings, bookedDates] = await Promise.all([
		getSettings(),
		getBookedDatesByCabinId(cabinId),
	]);

	return (
		<div className='grid grid-cols-2 border border-primary-800 min-h-[400px]'>
			<DateSelector
				settings={settings}
				bookedDates={bookedDates}
				cabin={cabin}
			/>

			{session?.user ? (
				<ReservationForm
					cabin={cabin}
					user={session?.user}
					bookedDates={bookedDates}
				/>
			) : (
				<LoginMessage />
			)}
		</div>
	);
}

export default Reservation;
