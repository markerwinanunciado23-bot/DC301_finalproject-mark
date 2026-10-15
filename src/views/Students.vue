
<script setup>
import { computed, ref } from 'vue'
import {
  Search, Plus, Pencil, Trash2, X,
  Download, RotateCcw, Users,
  ChevronLeft, ChevronRight, ShieldCheck
} from 'lucide-vue-next'
import { students, resetStudents } from '../stores/data'

const search = ref('')
const statusFilter = ref('All')
const courseFilter = ref('All')
const showForm = ref(false)
const editingId = ref(null)
const page = ref(1)
const pageSize = 7

const blank = () => ({
  studentNo: '',
  firstName: '',
  lastName: '',
  email: '',
  course: 'BSIT',
  yearLevel: '1st Year',
  status: 'Active'
})

const form = ref(blank())
const errors = ref({})

const filtered = computed(() =>
  students.value
    .filter(s => {
      const q = search.value.toLowerCase().trim()

      const matchText = !q || [
        s.studentNo,
        s.firstName,
        s.lastName,
        s.email,
        s.course
      ].some(v => String(v).toLowerCase().includes(q))

      return matchText &&
        (statusFilter.value === 'All' ||
          s.status === statusFilter.value) &&
        (courseFilter.value === 'All' ||
          s.course === courseFilter.value)
    })
    .sort((a, b) =>
      String(a.lastName).localeCompare(String(b.lastName))
    )
)

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize))
)

const visible = computed(() =>
  filtered.value.slice(
    (page.value - 1) * pageSize,
    page.value * pageSize
  )
)

function openAdd() {
  editingId.value = null
  form.value = blank()
  errors.value = {}
  showForm.value = true
}

function openEdit(student) {
  editingId.value = student.id
  form.value = { ...student }
  errors.value = {}
  showForm.value = true
}

function validate() {
  const e = {}

  if (!form.value.studentNo.trim()) {
    e.studentNo = 'Student number is required.'
  }

  if (
    students.value.some(s =>
      s.studentNo.toLowerCase() ===
        form.value.studentNo.trim().toLowerCase() &&
      s.id !== editingId.value
    )
  ) {
    e.studentNo = 'Student number already exists.'
  }

  if (!form.value.firstName.trim()) {
    e.firstName = 'First name is required.'
  }

  if (!form.value.lastName.trim()) {
    e.lastName = 'Last name is required.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    form.value.email.trim()
  )) {
    e.email = 'Enter a valid email address.'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

function save() {
  if (!validate()) return

  const record = {
    ...form.value,
    studentNo: form.value.studentNo.trim(),
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
    email: form.value.email.trim()
  }

  if (editingId.value !== null) {
    const i = students.value.findIndex(
      s => s.id === editingId.value
    )

    if (i !== -1) {
      students.value[i] = {
        ...students.value[i],
        ...record
      }
    }
  } else {
    students.value.unshift({
      id: Date.now(),
      ...record
    })
  }

  showForm.value = false
  page.value = 1
}

function removeStudent(student) {
  const confirmed = confirm(
    `Delete ${student.firstName} ${student.lastName} ` +
    `(${student.studentNo})? This cannot be undone.`
  )

  if (confirmed) {
    students.value = students.value.filter(
      item => item.id !== student.id
    )

    if (page.value > pageCount.value) {
      page.value = pageCount.value
    }
  }
}

function exportCsv() {
  const headers = [
    'Student No.',
    'First Name',
    'Last Name',
    'Email',
    'Course',
    'Year Level',
    'Status'
  ]

  const rows = filtered.value.map(s => [
    s.studentNo,
    s.firstName,
    s.lastName,
    s.email,
    s.course,
    s.yearLevel,
    s.status
  ])

  const quote = value =>
    '"' + String(value ?? '').replaceAll('"', '""') + '"'

  const csv = [headers, ...rows]
    .map(row => row.map(quote).join(','))
    .join('\r\n')

  const url = URL.createObjectURL(
    new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;'
    })
  )

  const a = document.createElement('a')
  a.href = url
  a.download = 'student-records.csv'
  a.click()

  URL.revokeObjectURL(url)
}

function resetDemo() {
  if (confirm(
    'Restore the original sample student records? ' +
    'Your current student changes will be replaced.'
  )) {
    resetStudents()
    page.value = 1
  }
}
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="section-kicker">DIRECTORY</div>
      <h1>Students</h1>
      <p>Create, search, update, and manage student records.</p>
    </div>

    <button class="btn btn-primary" @click="openAdd">
      <Plus :size="17" /> Add student
    </button>
  </div>

  <div class="stats-strip">
    <div>
      <span class="strip-icon icon-blue"><Users :size="18" /></span>
      <span>
        <small>Total records</small>
        <strong>{{ students.length }}</strong>
      </span>
    </div>

    <div>
      <span class="strip-icon icon-green">
        <span class="dot-solid"></span>
      </span>
      <span>
        <small>Active</small>
        <strong>
          {{ students.filter(s => s.status === 'Active').length }}
        </strong>
      </span>
    </div>

    <div>
      <span class="strip-icon icon-orange">
        <span class="dot-solid"></span>
      </span>
      <span>
        <small>Inactive</small>
        <strong>
          {{ students.filter(s => s.status !== 'Active').length }}
        </strong>
      </span>
    </div>
  </div>

  <section class="panel directory-panel">
    <div class="directory-toolbar">
      <div class="directory-title">
        <h2>All student records</h2>
        <span class="count-badge">{{ filtered.length }}</span>
      </div>

      <div class="directory-controls">
        <label class="search-input">
          <Search :size="16" />
          <input
            v-model="search"
            placeholder="Search students..."
            @input="page = 1"
          />
        </label>

        <select
          v-model="courseFilter"
          aria-label="Filter by course"
          @change="page = 1"
        >
          <option>All</option>
          <option>BSIT</option>
          <option>BSCS</option>
          <option>BSBA</option>
          <option>BSED</option>
        </select>

        <select
          v-model="statusFilter"
          aria-label="Filter by status"
          @change="page = 1"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>

    <div class="table-wrap">
      <table class="student-table">
        <thead>
          <tr>
            <th>STUDENT</th>
            <th>STUDENT NUMBER</th>
            <th>COURSE / YEAR</th>
            <th>STATUS</th>
            <th class="actions-heading">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(s, i) in visible"
            :key="s.id"
          >
            <td>
              <div class="person-cell">
                <span
                  class="table-avatar"
                  :class="'table-avatar-' + (i % 5)"
                >
                  {{ s.firstName[0] }}{{ s.lastName[0] }}
                </span>

                <span>
                  <b>{{ s.firstName }} {{ s.lastName }}</b>
                  <small>{{ s.email }}</small>
                </span>
              </div>
            </td>

            <td><span class="mono-text">{{ s.studentNo }}</span></td>

            <td>
              <span class="course-chip">{{ s.course }}</span>
              <small class="year-text">{{ s.yearLevel }}</small>
            </td>

            <td>
              <span
                class="status-pill"
                :class="s.status === 'Active'
                  ? 'status-active'
                  : 'status-inactive'"
              >
                <i></i>{{ s.status }}
              </span>
            </td>

            <td>
              <div class="row-actions">
                <button
                  class="row-action edit-action"
                  :aria-label="'Edit ' + s.firstName"
                  title="Edit student"
                  @click="openEdit(s)"
                >
                  <Pencil :size="16" />
                </button>

                <button
                  class="row-action delete-action"
                  :aria-label="'Delete ' + s.firstName"
                  title="Delete student"
                  @click="removeStudent(s)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!visible.length">
            <td colspan="5">
              <div class="empty-state">
                <Search :size="26" />
                <b>No students found</b>
                <p>Try a different search or add a new student record.</p>
                <button
                  class="btn btn-primary btn-small"
                  @click="openAdd"
                >
                  <Plus :size="15" /> Add student
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span>
        Showing
        <b>
          {{ filtered.length ? (page - 1) * pageSize + 1 : 0 }}–{{
            Math.min(page * pageSize, filtered.length)
          }}
        </b>
        of <b>{{ filtered.length }}</b> students
      </span>

      <div class="pagination">
        <button
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="page--"
        >
          <ChevronLeft :size="16" />
        </button>

        <span>Page {{ page }} of {{ pageCount }}</span>

        <button
          :disabled="page >= pageCount"
          aria-label="Next page"
          @click="page++"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>
  </section>

  <div class="directory-bottom">
    <span>
      <ShieldCheck :size="14" />
      Your changes save automatically in this browser.
    </span>

    <div>
      <button class="text-button" @click="resetDemo">
        <RotateCcw :size="14" /> Reset demo data
      </button>

      <button class="text-button" @click="exportCsv">
        <Download :size="14" /> Export CSV
      </button>
    </div>
  </div>

  <div
    v-if="showForm"
    class="modal-backdrop"
    @click.self="showForm = false"
    @keydown.esc="showForm = false"
  >
    <section
      class="modal-card"
      role="dialog"
      aria-modal="true"
      :aria-label="editingId ? 'Edit student' : 'Add student'"
    >
      <div class="modal-heading">
        <div>
          <div class="section-kicker">
            {{ editingId ? 'UPDATE RECORD' : 'NEW RECORD' }}
          </div>

          <h2>{{ editingId ? 'Edit student' : 'Add a student' }}</h2>
          <p>
            Enter the student's personal and academic details below.
          </p>
        </div>

        <button
          class="icon-button"
          aria-label="Close form"
          @click="showForm = false"
        >
          <X :size="20" />
        </button>
      </div>

      <form class="student-form" @submit.prevent="save">
        <div class="form-grid">
          <label class="field">
            <span>Student number <b>*</b></span>
            <input
              v-model="form.studentNo"
              placeholder="e.g. 2026-0006"
            />
            <small v-if="errors.studentNo" class="field-error">
              {{ errors.studentNo }}
            </small>
          </label>

          <label class="field">
            <span>Email address <b>*</b></span>
            <input
              v-model="form.email"
              type="email"
              placeholder="student@example.com"
            />
            <small v-if="errors.email" class="field-error">
              {{ errors.email }}
            </small>
          </label>

          <label class="field">
            <span>First name <b>*</b></span>
            <input
              v-model="form.firstName"
              placeholder="Enter first name"
            />
            <small v-if="errors.firstName" class="field-error">
              {{ errors.firstName }}
            </small>
          </label>

          <label class="field">
            <span>Last name <b>*</b></span>
            <input
              v-model="form.lastName"
              placeholder="Enter last name"
            />
            <small v-if="errors.lastName" class="field-error">
              {{ errors.lastName }}
            </small>
          </label>

          <label class="field">
            <span>Course <b>*</b></span>
            <select v-model="form.course">
              <option>BSIT</option>
              <option>BSCS</option>
              <option>BSBA</option>
              <option>BSED</option>
            </select>
          </label>

          <label class="field">
            <span>Year level <b>*</b></span>
            <select v-model="form.yearLevel">
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>5th Year</option>
            </select>
          </label>

          <label class="field field-full">
            <span>Enrollment status</span>
            <select v-model="form.status">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-white"
            @click="showForm = false"
          >
            Cancel
          </button>

          <button type="submit" class="btn btn-primary">
            {{ editingId ? 'Save changes' : 'Create student' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
