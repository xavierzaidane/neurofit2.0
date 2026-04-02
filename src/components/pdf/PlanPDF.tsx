'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

type WorkoutRoutine = {
  name: string;
  sets?: number;
  reps?: number;
  description?: string;
};

type WorkoutExerciseDay = {
  day: string;
  routines: WorkoutRoutine[];
};

type WorkoutPlan = {
  schedule: string[];
  exercises: WorkoutExerciseDay[];
};

type DietMeal = {
  name: string;
  foods: string[];
};

type DietPlan = {
  dailyCalories: number;
  meals: DietMeal[];
};

type MacrosPlan = {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

type GroceryCategory = {
  name: string;
  items: string[];
};

type GroceryListPlan = {
  categories: GroceryCategory[];
};

type PlanPDFProps = {
  plan: {
    name: string;
    workoutPlan: WorkoutPlan;
    dietPlan: DietPlan;
  };
  macrosPlan?: MacrosPlan;
  grocerylistPlan?: GroceryListPlan;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2pt solid #000',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionDivider: {
    borderBottom: '1pt solid #e0e0e0',
    marginTop: 20,
    marginBottom: 15,
  },
  scheduleText: {
    fontSize: 10,
    marginBottom: 10,
    fontWeight: 'normal',
  },
  dayHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  exerciseItem: {
    marginBottom: 10,
    paddingLeft: 15,
    fontSize: 9,
  },
  exerciseName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  exerciseSetsReps: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  exerciseDescription: {
    fontSize: 8,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  mealName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 8,
  },
  foodItem: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 2,
  },
  macroGrid: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  macroBox: {
    flex: 1,
    border: '1pt solid #ddd',
    padding: 10,
  },
  macroLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 8,
  },
  categoryItem: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 2,
  },
});

const PlanPDF = ({ plan, macrosPlan, grocerylistPlan }: PlanPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FITNESS PLAN</Text>
        <Text style={{ fontSize: 12, marginTop: 5 }}>{plan.name}</Text>
      </View>

      {/* Workout Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Plan</Text>

        <Text style={styles.scheduleText}>
          <Text style={{ fontWeight: 'bold' }}>Schedule: </Text>
          {plan.workoutPlan.schedule.join(', ')}
        </Text>

        {plan.workoutPlan.exercises.map((exerciseDay, dayIndex) => (
          <View key={dayIndex}>
            <Text style={styles.dayHeader}>{exerciseDay.day}</Text>

            {exerciseDay.routines.map((routine, routineIndex) => (
              <View key={routineIndex} style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{routine.name}</Text>
                <Text style={styles.exerciseSetsReps}>
                  {routine.sets} sets × {routine.reps} reps
                </Text>
                {routine.description && (
                  <Text style={styles.exerciseDescription}>
                    {routine.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.sectionDivider} />

      {/* Diet Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diet Plan</Text>

        <Text style={{ fontSize: 10, marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>Daily Calories: </Text>
          {plan.dietPlan.dailyCalories}K
        </Text>

        {plan.dietPlan.meals.map((meal, mealIndex) => (
          <View key={mealIndex}>
            <Text style={styles.mealName}>{meal.name}</Text>
            {meal.foods.map((food, foodIndex) => (
              <Text key={foodIndex} style={styles.foodItem}>
                • {food}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.sectionDivider} />

      {/* Macros Section */}
      {macrosPlan && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macros</Text>

          {/* Two rows of macro boxes */}
          <View style={styles.macroGrid}>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Calories</Text>
              <Text style={styles.macroValue}>{macrosPlan.dailyCalories}</Text>
              <Text style={{ fontSize: 7, color: '#999' }}>kcal</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{macrosPlan.proteinGrams}</Text>
              <Text style={{ fontSize: 7, color: '#999' }}>g</Text>
            </View>
          </View>

          <View style={styles.macroGrid}>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{macrosPlan.carbsGrams}</Text>
              <Text style={{ fontSize: 7, color: '#999' }}>g</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{macrosPlan.fatGrams}</Text>
              <Text style={{ fontSize: 7, color: '#999' }}>g</Text>
            </View>
          </View>
        </View>
      )}

      {macrosPlan && <View style={styles.sectionDivider} />}

      {/* Grocery List Section */}
      {grocerylistPlan?.categories?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grocery List</Text>

          {grocerylistPlan.categories.map((category, categoryIndex) => (
            <View key={categoryIndex}>
              <Text style={styles.categoryName}>{category.name}</Text>
              {category.items.map((item, itemIndex) => (
                <Text key={itemIndex} style={styles.categoryItem}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </Page>
  </Document>
);

export default PlanPDF;
