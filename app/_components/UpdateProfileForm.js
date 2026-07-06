"use client";

import { updateGuest } from "@/_lib/actions";
import SubmissionButton from "@/_components/SubmissionButton";
import SpinnerMini from "@/_components/SpinnerMini";
import toast from "react-hot-toast";

const UpdateProfileForm = ({ guest, children }) => {
	const { fullName, email, nationalID, countryFlag } = guest;

	const disabled = !fullName || !email || !nationalID || !countryFlag;

	const handleSubmit = async (formData) => {
		const result = await updateGuest(formData);

		if (result?.success === false) {
			toast.error(result.message);
			return;
		}

		toast.success("Profile updated successfully!");
	};

	return (
		<form
			action={handleSubmit}
			className='bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col'>
			<div className='space-y-2'>
				<label>Full name</label>
				<input
					disabled
					defaultValue={fullName}
					className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
				/>
			</div>

			<div className='space-y-2'>
				<label>Email address</label>
				<input
					disabled
					defaultValue={email}
					type='email'
					name='email'
					className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
				/>
			</div>

			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<label htmlFor='nationality'>Where are you from?</label>
					<img
						src={countryFlag}
						alt='Country flag'
						className='h-5 rounded-sm'
					/>
				</div>

				{children}
			</div>

			<div className='space-y-2'>
				<label htmlFor='nationalID'>National ID number</label>
				<input
					name='nationalID'
					maxLength={14}
					minLength={6}
					defaultValue={nationalID}
					className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
				/>
			</div>

			<div className='flex justify-end items-center gap-6'>
				<SubmissionButton
					disabled={disabled}
					pendingLabel={
						<div className='max-auto'>
							<SpinnerMini />
						</div>
					}>
					Update profile
				</SubmissionButton>
			</div>
		</form>
	);
};

export default UpdateProfileForm;
