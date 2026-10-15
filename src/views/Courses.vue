
<script setup>
import { computed, ref } from 'vue'
import {
  Plus, Pencil, Trash2, X, BookOpen, Search, Users
} from 'lucide-vue-next'
import { courses, students } from '../stores/data'

const search = ref('')
const showForm = ref(false)
const editingId = ref(null)

const blank = () => ({
  code: '',
  name: '',
  department: 'Computing'
})

const form = ref(blank())
const error = ref('')

const list = computed(() =>
  courses.value.filter(c =>
    [c.code, c.name, c.department].some(v =>
      v.toLowerCase().includes(search.value.toLowerCase().trim())
    )
  )
)

function openAdd() {
  editingId.value = null
  form.value = blank()
  error.value = ''
  showForm.value = true
}

function openEdit(course) {
  editingId.value = course.id
  form.value = { ...course }
  error.value = ''
  showForm.value = true
}

function save() {
  form.value.code = form.value.code.trim().toUpperCase()
  form.value.name = form.value.name.trim()
  form.value.department = form.value.department.trim()

  if (
    !form.value.code ||
    !form.value.name ||
    !form.value.department
  ) {
    error.value = 'Please complete all fields.'
    return
  }

  if (
    courses.value.some(c =>
      c.code.toLowerCase() === form.value.code.toLowerCase() &&
      c.id !== editingId.value
    )
  ) {
    error.value = 'That course code already exists.'
    return
  }

  if (editingId.value !== null) {
    const i = courses.value.findIndex(
      c => c.id === editingId.value
    )

    if (i !== -1) {
      courses.value[i] = {
        ...courses.value[i],
        ...form.value
      }
    }
  } else {
    courses.value.push({
      id: Date.now(),
      ...form.value
    })
  }

  showForm.value = false
}

function removeCourse(course) {
  const enrolled = students.value.some(
    s => s.course === course.code
  )

  if (enrolled) {
    alert(
      'This course is assigned to one or more students. ' +
      'Update those student records before deleting the course.'
    )
    return
  }

  if (confirm(`Delete course ${course.code} — ${course.name}?`)) {
    courses.value = courses.value.filter(
      item => item.id !== course.id
    )
  }
}
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="section-kicker">ACADEMICS</div>
      <h1>Courses</h1>
      <p>Manage academic programs and their departments.</p>
    </div>

    <button class="btn btn-primary" @click="openAdd">
      <Plus :size="17" /> Add course
    </button>
  </div>

  <section class="course-summary">
    <div class="course-summary-icon">
      <BookOpen :size="24" />
    </div>

    <div>
      <small>ACADEMIC PROGRAMS</small>
      <strong>
        {{ courses.length }}
        <span>courses registered</span>
      </strong>
      <p>
        Student counts update automatically as student records change.
      </p>
    </div>

    <div class="summary-students">
      <Users :size="18" />
      <b>{{ students.length }}</b>
      <span>students total</span>
    </div>
  </section>

  <div class="course-list-heading">
    <div>
      <h2>Course directory</h2>
      <p>Browse and maintain the programs offered.</p>
    </div>

    <label class="search-input course-search">
      <Search :size="16" />
      <input v-model="search" placeholder="Search courses..." />
    </label>
  </div>

  <section v-if="list.length" class="course-card-grid">
    <article
      v-for="(c, i) in list"
      :key="c.id"
      class="course-card"
    >
      <div class="course-card-top">
        <div
          class="course-symbol"
          :class="'course-symbol-' + (i % 4)"
        >
          <BookOpen :size="21" />
        </div>

        <div class="course-card-actions">
          <button
            class="row-action edit-action"
            title="Edit course"
            :aria-label="'Edit ' + c.code"
            @click="openEdit(c)"
          >
            <Pencil :size="16" />
          </button>

          <button
            class="row-action delete-action"
            title="Delete course"
            :aria-label="'Delete ' + c.code"
            @click="removeCourse(c)"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>

      <span class="course-code">{{ c.code }}</span>
      <h3>{{ c.name }}</h3>
      <p class="department-label">
        {{ c.department }} department
      </p>

      <div class="course-card-bottom">
        <span>
          <Users :size="13" />
          {{ students.filter(s => s.course === c.code).length }}
          enrolled students
        </span>
        <span class="course-active-dot">● Active</span>
      </div>
    </article>
  </section>

  <section v-else class="panel empty-state">
    <Search :size="28" />
    <b>No courses found</b>
    <p>Try another search or add a course.</p>
    <button class="btn btn-primary" @click="openAdd">
      <Plus :size="16" /> Add course
    </button>
  </section>

  <div
    v-if="showForm"
    class="modal-backdrop"
    @click.self="showForm = false"
  >
    <section class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-heading">
        <div>
          <div class="section-kicker">
            {{ editingId ? 'UPDATE COURSE' : 'NEW COURSE' }}
          </div>
          <h2>{{ editingId ? 'Edit course' : 'Add a course' }}</h2>
          <p>Provide the course code, name, and department.</p>
        </div>

        <button
          class="icon-button"
          aria-label="Close"
          @click="showForm = false"
        >
          <X :size="20" />
        </button>
      </div>

      <form class="student-form" @submit.prevent="save">
        <div v-if="error" class="form-error">{{ error }}</div>

        <div class="form-grid">
          <label class="field">
            <span>Course code <b>*</b></span>
            <input v-model="form.code" placeholder="e.g. BSIT" />
          </label>

          <label class="field">
            <span>Department <b>*</b></span>
            <input
              v-model="form.department"
              placeholder="e.g. Computing"
            />
          </label>

          <label class="field field-full">
            <span>Full course name <b>*</b></span>
            <input
              v-model="form.name"
              placeholder="Enter official program name"
            />
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
            {{ editingId ? 'Save changes' : 'Create course' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
