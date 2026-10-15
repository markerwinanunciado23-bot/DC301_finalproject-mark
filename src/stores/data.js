import { ref, watch } from 'vue'

const starterStudents = [{
        id: 1001,
        studentNo: '2026-0001',
        firstName: 'Maria Lance',
        lastName: 'Aparicio',
        email: 'maria.santos@example.com',
        course: 'BSIT',
        yearLevel: '3rd Year',
        status: 'Active'
    },
    {
        id: 1002,
        studentNo: '2026-0002',
        firstName: 'John',
        lastName: 'Romel',
        email: 'john.reyes@example.com',
        course: 'BSCS',
        yearLevel: '2nd Year',
        status: 'Active'
    },
    {
        id: 1003,
        studentNo: '2026-0003',
        firstName: 'Jeneza',
        lastName: 'Cruz',
        email: 'angela.cruz@example.com',
        course: 'BSIT',
        yearLevel: '1st Year',
        status: 'Inactive'
    },
    {
        id: 1004,
        studentNo: '2026-0004',
        firstName: 'Mark Erwin',
        lastName: 'Nabunturan',
        email: 'mark.garcia@example.com',
        course: 'BSBA',
        yearLevel: '4th Year',
        status: 'Active'
    },
    {
        id: 1005,
        studentNo: '2026-0005',
        firstName: 'Mary Jhen',
        lastName: 'Dela Cruz',
        email: 'nicole.dc@example.com',
        course: 'BSED',
        yearLevel: '3rd Year',
        status: 'Active'
    }
]

const starterCourses = [{
        id: 1,
        code: 'BSIT',
        name: 'Bachelor of Science in Information Technology',
        department: 'Computing',
        students: 2
    },
    {
        id: 2,
        code: 'BSCS',
        name: 'Bachelor of Science in Computer Science',
        department: 'Computing',
        students: 1
    },
    {
        id: 3,
        code: 'BSBA',
        name: 'Bachelor of Science in Business Administration',
        department: 'Business',
        students: 1
    },
    {
        id: 4,
        code: 'BSED',
        name: 'Bachelor of Secondary Education',
        department: 'Education',
        students: 1
    }
]

function read(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key))
        return Array.isArray(value) ? value : fallback
    } catch {
        return fallback
    }
}

export const students = ref(
    read('sis_students', starterStudents)
)

export const courses = ref(
    read('sis_courses', starterCourses)
)

watch(
    students,
    value => localStorage.setItem(
        'sis_students',
        JSON.stringify(value)
    ), { deep: true }
)

watch(
    courses,
    value => localStorage.setItem(
        'sis_courses',
        JSON.stringify(value)
    ), { deep: true }
)

export function resetStudents() {
    students.value = starterStudents.map(item => ({...item }))
}

export function resetCourses() {
    courses.value = starterCourses.map(item => ({...item }))
}