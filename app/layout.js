import { Josefin_Sans } from "next/font/google";

import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";
import Providers from "@/app/_components/SessionProvider";

import { ReservationProvider } from "@/_context/ReservationsContext";
import { Toaster } from "react-hot-toast";

const Josefin = Josefin_Sans({
	subsets: ["latin"],
	display: "swap",
});

export const metadata = {
	title: {
		template: "%s | The Wild Oasis",
		default: "Welcome | The Wild Oasis",
	},

	description: "This is the description",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${Josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col`}>
				<Header />
				<div className='flex-1 px-8 py-12 grid '>
					<main className='max-w-7xl mx-auto w-full'>
						<ReservationProvider>
							<Providers>
								{children}{" "}
								<Toaster position='top-center' reverseOrder={false} />
							</Providers>
						</ReservationProvider>
					</main>
				</div>
			</body>
		</html>
	);
}
