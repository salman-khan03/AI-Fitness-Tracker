/* eslint-env node */
import { initializeDatabase, saveDatabaseSnapshot, getDataPath } from './lib/storage.js'
import { loadEnv } from './lib/env.js'

loadEnv()

const sampleData = {
  workouts: [
    {
      id: 'workout_push_power',
      title: 'Push Power Hour',
      goal: 'Upper body strength focus',
      workoutDate: '2025-01-06',
      durationMinutes: 68,
      energy: 8,
      mood: 'locked-in',
      notes: 'Felt strong, small elbow discomfort on skull crushers',
      tags: ['strength', 'push'],
      exercises: [
        {
          id: 'exercise_bench_press',
          name: 'Barbell Bench Press',
          muscleGroup: 'Chest',
          type: 'strength',
          sets: [
            { id: 'set_bb_bp_1', order: 1, weight: 185, reps: 8, rir: 2 },
            { id: 'set_bb_bp_2', order: 2, weight: 195, reps: 6, rir: 1 },
            { id: 'set_bb_bp_3', order: 3, weight: 205, reps: 4, rir: 1 }
          ]
        },
        {
          id: 'exercise_db_shoulder_press',
          name: 'Dumbbell Shoulder Press',
          muscleGroup: 'Shoulders',
          type: 'strength',
          sets: [
            { id: 'set_db_sp_1', order: 1, weight: 65, reps: 10, rir: 1 },
            { id: 'set_db_sp_2', order: 2, weight: 65, reps: 8, rir: 1 }
          ]
        },
        {
          id: 'exercise_tricep_dips',
          name: 'Weighted Dips',
          muscleGroup: 'Triceps',
          type: 'strength',
          sets: [
            { id: 'set_dips_1', order: 1, weight: 35, reps: 10, rir: 2 },
            { id: 'set_dips_2', order: 2, weight: 35, reps: 8, rir: 1 }
          ]
        }
      ],
      createdAt: '2025-01-06T14:00:00.000Z',
      updatedAt: '2025-01-06T14:00:00.000Z'
    },
    {
      id: 'workout_pull_engine',
      title: 'Pull Engine Builder',
      goal: 'Posterior chain volume',
      workoutDate: '2025-01-08',
      durationMinutes: 72,
      energy: 7,
      mood: 'focused',
      notes: 'Deadlifts felt heavy, grip challenged on final set',
      tags: ['strength', 'pull'],
      exercises: [
        {
          id: 'exercise_deadlift',
          name: 'Conventional Deadlift',
          muscleGroup: 'Back',
          type: 'strength',
          sets: [
            { id: 'set_dl_1', order: 1, weight: 275, reps: 5, rir: 1 },
            { id: 'set_dl_2', order: 2, weight: 295, reps: 3, rir: 1 }
          ]
        },
        {
          id: 'exercise_pullups',
          name: 'Weighted Pull-ups',
          muscleGroup: 'Back',
          type: 'strength',
          sets: [
            { id: 'set_wp_1', order: 1, weight: 25, reps: 8, rir: 2 },
            { id: 'set_wp_2', order: 2, weight: 25, reps: 7, rir: 1 }
          ]
        },
        {
          id: 'exercise_facepulls',
          name: 'Cable Face Pulls',
          muscleGroup: 'Rear Delts',
          type: 'accessory',
          sets: [
            { id: 'set_fp_1', order: 1, weight: 65, reps: 15, rir: 2 },
            { id: 'set_fp_2', order: 2, weight: 65, reps: 15, rir: 2 }
          ]
        }
      ],
      createdAt: '2025-01-08T13:00:00.000Z',
      updatedAt: '2025-01-08T13:00:00.000Z'
    },
    {
      id: 'workout_leg_day',
      title: 'Leg Day Foundation',
      goal: 'Quad & glute strength',
      workoutDate: '2025-01-10',
      durationMinutes: 75,
      energy: 9,
      mood: 'energized',
      notes: 'New personal best on squats',
      tags: ['strength', 'legs'],
      exercises: [
        {
          id: 'exercise_back_squat',
          name: 'Back Squat',
          muscleGroup: 'Quads',
          type: 'strength',
          sets: [
            { id: 'set_bs_1', order: 1, weight: 245, reps: 6, rir: 2 },
            { id: 'set_bs_2', order: 2, weight: 265, reps: 5, rir: 1 },
            { id: 'set_bs_3', order: 3, weight: 275, reps: 3, rir: 1 }
          ]
        },
        {
          id: 'exercise_leg_press',
          name: '45° Leg Press',
          muscleGroup: 'Quads',
          type: 'strength',
          sets: [
            { id: 'set_lp_1', order: 1, weight: 410, reps: 12, rir: 2 },
            { id: 'set_lp_2', order: 2, weight: 410, reps: 11, rir: 2 }
          ]
        },
        {
          id: 'exercise_calf_raise',
          name: 'Standing Calf Raise',
          muscleGroup: 'Calves',
          type: 'accessory',
          sets: [
            { id: 'set_cr_1', order: 1, weight: 185, reps: 15, rir: 2 },
            { id: 'set_cr_2', order: 2, weight: 185, reps: 15, rir: 2 }
          ]
        }
      ],
      createdAt: '2025-01-10T11:00:00.000Z',
      updatedAt: '2025-01-10T11:00:00.000Z'
    }
  ],
  routines: [
    {
      id: 'routine_push_pull_legs',
      title: 'Push / Pull / Legs 8-week Accelerator',
      focus: 'Hypertrophy',
      difficulty: 'Intermediate',
      description: 'Classic bro split optimized with progressive overload and tempo discipline.',
      weeks: 8,
      workouts: [
        {
          day: 'Day 1',
          title: 'Push Prime',
          objective: 'Chest & triceps volume',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '6-8' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10' },
            { name: 'Cable Flys', sets: 3, reps: '12-15' }
          ]
        },
        {
          day: 'Day 2',
          title: 'Pull Recharge',
          objective: 'Back density',
          exercises: [
            { name: 'Weighted Pull-ups', sets: 4, reps: '6-8' },
            { name: 'Barbell Rows', sets: 3, reps: '8-10' },
            { name: 'Reverse Fly Machine', sets: 3, reps: '12-15' }
          ]
        },
        {
          day: 'Day 3',
          title: 'Leg Powerhouse',
          objective: 'Strength & athleticism',
          exercises: [
            { name: 'Back Squat', sets: 4, reps: '5-6' },
            { name: 'Romanian Deadlift', sets: 3, reps: '8-10' },
            { name: 'Walking Lunges', sets: 3, reps: '12 each leg' }
          ]
        }
      ],
      createdAt: '2025-01-01T10:00:00.000Z',
      updatedAt: '2025-01-01T10:00:00.000Z'
    }
  ],
  reminders: [
    {
      id: 'reminder_morning_training',
      title: '5:45am Lift Club',
      description: 'Pack gear, hydrate and hit the gym before sunrise.',
      cadence: { type: 'weekly', days: ['Mon', 'Wed', 'Fri'] },
      timeOfDay: '05:45',
      isActive: true,
      createdAt: '2025-01-01T09:00:00.000Z',
      updatedAt: '2025-01-01T09:00:00.000Z'
    },
    {
      id: 'reminder_active_recovery',
      title: 'Active Recovery Mobility',
      description: '20 minutes of mobility and walking to stay fresh.',
      cadence: { type: 'weekly', days: ['Sun'] },
      timeOfDay: '09:30',
      isActive: true,
      createdAt: '2025-01-02T09:00:00.000Z',
      updatedAt: '2025-01-02T09:00:00.000Z'
    }
  ]
}

await initializeDatabase()
await saveDatabaseSnapshot(sampleData)

console.log('Seeded local database at', getDataPath())
