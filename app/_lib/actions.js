"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// update the guest
export async function updateGuest(formData) {
	// check if the user is authorized or not
	const session = await auth();
	if (!session?.user) throw new Error("You must be logged in!");

	// handle the data to send it to back end
	// 1- national ID
	const nationalID = formData.get("nationalID");

	// check the nationalID is valid or not
	if (!/^\d{6,14}$/.test(nationalID))
		throw new Error("Please provide a valid national ID!");

	// 2- countryFlag
	const [nationality, countryFlag] = formData.get("nationality").split("%");

	// 3- send the data to be
	const updatedData = { nationalID, countryFlag, nationality };

	const { error } = await supabase
		.from("guests")
		.update(updatedData)
		.eq("id", session.user.guestId);

	if (error) {
		return {
			success: false,
			message: `Guest could not be updated: ${error.message}`,
		};
	}

	// revalidate the data about the nationalID, countryFlag immediately by usingrevalidatePath
	revalidatePath("/account/profile");
}

// delete the guest reservations
export async function deleteBooking(bookingId) {
	// check if the user is authorized or not
	const session = await auth();
	if (!session?.user) throw new Error("You must be logged in!");

	// guard action
	const guestBookings = await getBookings(session.user.guestId);
	const guestBookingsIds = guestBookings.map((booking) => booking.id);

	if (!guestBookingsIds?.includes(bookingId))
		throw new Error("Your not allowed to delete this booking");

	const { error } = await supabase
		.from("bookings")
		.delete()
		.eq("id", bookingId);
	if (error)
		return {
			success: false,
			message: `Booking could not be deleted : ${error.message}`,
		};

	// revalidate
	revalidatePath("account/reservations");
}

// update the reservation
export async function updateBooking(formData) {
	const bookingId = Number(formData.get("bookingId"));
	// 1) authentication
	const session = await auth();
	if (!session?.user) throw new Error("You must be logged in!");

	// 2) authorized
	const guestBookings = await getBookings(session.user.guestId);
	const guestBookingsIds = guestBookings.map((booking) => booking.id);
	if (!guestBookingsIds.includes(bookingId))
		throw new Error("Your not allowed to update this booking");

	// 3) building update data
	const updatedData = {
		numGuests: Number(formData.get("numGuests")),
		observations: formData.get("observations").slice(0, 1000),
	};

	// 4) Mutation data
	const { error } = await supabase
		.from("bookings")
		.update(updatedData)
		.eq("id", bookingId)
		.select()
		.single();

	// 5) Error handling
	if (error) return { success: false, message: "Booking could not be updated" };

	// 6) Revalidation
	revalidatePath("/account/reservations");
	revalidatePath(`/account/reservations/edit/${bookingId}`);

	// 7) Redirect
	redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
	const session = await auth();
	if (!session?.user) throw new Error("You must be logged in!");

	const newBooking = {
		...bookingData,
		guestId: session.user.guestId,
		numGuests: Number(formData.get("numGuests")),
		observations: formData.get("observations").slice(0, 1000),
		extrasPrice: 0,
		totalPrice: bookingData.cabinPrice,
		isPaid: false,
		hasBreakfast: false,
		status: "unconfirmed",
	};

	const { error } = await supabase.from("bookings").insert([newBooking]);

	if (error) {
		console.error(error);
		// Return instead of throw -> lets the client catch it cleanly
		return { success: false, message: "Booking could not be created" };
	}

	revalidatePath(`/cabins/${newBooking.cabinId}`);
	return { success: true, cabinId: newBooking.cabinId };
}

export async function signInAction() {
	await signIn("google", {
		redirectTo: "/account",
	});
}

export async function signOutAction() {
	await signOut({
		redirectTo: "/",
	});
}
