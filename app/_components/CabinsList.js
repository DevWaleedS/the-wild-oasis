import CabinCard from "@/_components/CabinCard";

import { getCabins } from "@/_lib/data-service";

async function CabinsList({ filters }) {
	const cabins = await getCabins();

	// implement the filter
	let displayedCabins;

	if (filters === "all") {
		displayedCabins = cabins;
	}
	if (filters === "small")
		displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);

	if (filters === "medium")
		displayedCabins = cabins.filter(
			(cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
		);

	if (filters === "large")
		displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

	// if no cabins return null
	if (!cabins.length) return null;

	return (
		<div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
			{displayedCabins.map((cabin) => (
				<CabinCard cabin={cabin} key={cabin.id} />
			))}
		</div>
	);
}

export default CabinsList;
