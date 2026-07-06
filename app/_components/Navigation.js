import { auth } from "@/_lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Navigation() {
	let session = null;
	try {
		session = await auth();
	} catch (error) {
		console.error("Auth error in Navigation:", error);
	}

	return (
		<nav className='z-10 text-xl'>
			<ul className='flex gap-16 items-center'>
				<li>
					<Link
						href='/cabins'
						className='hover:text-accent-400 transition-colors'>
						Cabins
					</Link>
				</li>
				<li>
					<Link
						href='/about'
						className='hover:text-accent-400 transition-colors'>
						About
					</Link>
				</li>
				<li>
					{session?.user.image ? (
						<Link
							href='/account'
							className='hover:text-accent-400 transition-colors'>
							<div className='relative inline-flex mr-2 -mb-1.5  w-8 h-8'>
								<Image
									fill
									className='object-cover rounded-full'
									src={session.user.image}
									alt={session.user.name}
								/>
							</div>
							<span>{session?.user.name}</span>
						</Link>
					) : (
						<Link
							href='/account'
							className='hover:text-accent-400 transition-colors'>
							Guest area
						</Link>
					)}
				</li>
			</ul>
		</nav>
	);
}
