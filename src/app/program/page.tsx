"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import ProgramFormTabs from "../../components/program/ProgramFormTabs";
import ProgramFormActions from "../../components/program/ProgramFormActions";
import ProgramFormSkeleton from "../../components/program/ProgramFormSkeleton";
import LoadingScreen from "@/app/loading/page";
import {
	initialProgramFormData,
	sampleProgramFormData,
	type ProgramFormData,
} from "@/data/samples";

const inputClassName =
	"w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20";

const ProgramPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSubmitLoading, setShowSubmitLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const { user } = useUser();
	const router = useRouter();
	const form = useForm({
		defaultValues: initialProgramFormData as ProgramFormData,
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			setSubmitError(null);
			setSubmitSuccess(false);

			if (!user?.id) {
				setSubmitError("Please sign in to generate a program.");
				setIsSubmitting(false);
				return;
			}

			const convexHttpUrl = process.env.NEXT_PUBLIC_CONVEX_HTTP_URL;
			if (!convexHttpUrl) {
				setSubmitError("Missing NEXT_PUBLIC_CONVEX_HTTP_URL environment variable.");
				setIsSubmitting(false);
				return;
			}

			try {
				const response = await fetch(`${convexHttpUrl}/ollama/generate-program`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						user_id: user.id,
						age: value.age,
						height: value.height,
						weight: value.weight,
						gender: value.gender,
						status: value.status,
						body_fat: value.bodyFat,
						injuries: value.injuries,
						workout_days: value.workoutDays,
						training_style: value.trainingStyle,
						target_timeline: value.targetTimeline,
						fitness_goal: value.fitnessGoal,
						fitness_level: value.fitnessLevel,
						dietary_restrictions: value.dietaryRestrictions,
						food_allergies: value.foodAllergies,
						daily_calories: value.dailyCalories,
						protein_target: value.proteinTarget,
						carbs_target: value.carbsTarget,
						fat_target: value.fatTarget,
						meals_per_day: value.mealsPerDay,
						working_hours: value.workingHours,
						sleep_hours: value.sleepHours,
						stress_level: value.stressLevel,
						workout_time: value.workoutTime,
						available_equipment: value.availableEquipment,
						country_region: value.countryRegion,
						city_region: value.cityRegion,
					}),
				});

				const data = await response.json();
				if (!response.ok || !data?.success) {
					throw new Error(data?.error || "Failed to generate program.");
				}

				setSubmitSuccess(true);
				router.push("/profile");
			} catch (error) {
				setSubmitError(error instanceof Error ? error.message : "  generate program.");
			} finally {
				setIsSubmitting(false);
				setShowSubmitLoading(false);
			}
		},
		onSubmitInvalid: () => {
			setSubmitError("Please complete the required fields before submitting.");
			setIsSubmitting(false);
		},
	});

	useEffect(() => {
		const timer = window.setTimeout(() => setIsLoading(false), 900);
		return () => window.clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!isSubmitting) {
			setShowSubmitLoading(false);
			return;
		}

		const timer = window.setTimeout(() => {
			setShowSubmitLoading(true);
		}, 220);

		return () => window.clearTimeout(timer);
	}, [isSubmitting]);

	const handleGenerateSamples = () => {
		form.reset(sampleProgramFormData, { keepDefaultValues: true });
	};

	const handleClear = () => {
		form.reset(initialProgramFormData, { keepDefaultValues: true });
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitError(null);
		setSubmitSuccess(false);
		await form.handleSubmit();
	};

	return (
		<section className="max-w-5xl relative z-10 pt-20 pb-32 flex-grow container mx-auto px-4 md:px-6">
			{showSubmitLoading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
					<LoadingScreen />
				</div>
			)}
			<form
				className={`space-y-8 transition-opacity duration-300 ${
					isSubmitting ? "opacity-0 pointer-events-none" : "opacity-100"
				}`}
				onSubmit={handleSubmit}
			>
				<div className="text-left pt-10">
					<h1 className="text-3xl md:text-3xl font-normal tracking-tight text-white selection:bg-[var(--foreground)]/30 text-white">
						Fitness Plan Intake
					</h1>
					<p className="text-sm font-mono text-white/60 mt-2">
						Tell us about your goals to generate a personalized plan.
					</p>
				</div>

				{isLoading ? (
					<ProgramFormSkeleton />
				) : (
					<ProgramFormTabs
						form={form}
						inputClassName={inputClassName}
					/>
				)}

				<form.Subscribe
					selector={(state) => state.values}
					children={(values) => (
						<ProgramFormActions
							previewRows={[
								{ label: "Age", value: values.age },
								{ label: "Height", value: values.height },
								{ label: "Weight", value: values.weight },
								{ label: "Country", value: values.countryRegion },
								{ label: "City", value: values.cityRegion },
								{ label: "Goal", value: values.fitnessGoal },
								{ label: "Level", value: values.fitnessLevel },
								{ label: "Calories", value: values.dailyCalories },
								{ label: "Allergies", value: values.foodAllergies },
								{ label: "Workout Days", value: values.workoutDays },
								{ label: "Workout Time", value: values.workoutTime },
								{ label: "Sleep", value: values.sleepHours },
							]}
							isLoading={isLoading}
							isSubmitting={isSubmitting}
							onClear={handleClear}
							onGenerateSamples={handleGenerateSamples}
						/>
					)}
				/>

				{submitError && (
					<p className="text-sm font-mono text-red-300">{submitError}</p>
				)}
				{submitSuccess && (
					<p className="text-sm font-mono text-emerald-300">
						Program created. Redirecting to your profile...
					</p>
				)}
			</form>
		</section>
	);
};

export default ProgramPage;
