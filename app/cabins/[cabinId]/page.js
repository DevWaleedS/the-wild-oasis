import Reservation from "@/_components/Reservation";
import { getCabin, getCabins } from "@/_lib/data-service";
import Cabin from "@/_components/Cabin";
import { Suspense } from "react";
import Spinner from "@/_components/Spinner";

// re-fetch the data from the server every 60 min.
export const revalidate = 3600;

// to generate the dynamic metadata
export async function generateMetadata({ params }) {
	const { cabinId } = await params;
	const cabin = await getCabin(cabinId);
	const { name, description } = cabin;

	return {
		title: `Cabin ${name}`,
		description,
	};
}

// generate all the dynamic params to make this page static
export async function generateStaticParams() {
	const cabins = await getCabins();

	return cabins.map((cabin) => ({
		cabinId: String(cabin.id),
	}));
}

export default async function Page({ params }) {
	const { cabinId } = await params;
	const cabin = await getCabin(cabinId);

	return (
		<div className='max-w-6xl mx-auto mt-8'>
			<Cabin cabinId={cabinId} />

			<div>
				<h2 className='text-5xl font-semibold text-center mb-10 text-accent-400'>
					Reserve {cabin?.name} today. Pay on arrival.
				</h2>
				<Suspense fallback={<Spinner />}>
					<Reservation cabinId={cabinId} />
				</Suspense>
			</div>
		</div>
	);
}
