
<script setup>
import { computed } from 'vue'
import {
  Download, Users, BookOpen, UserCheck,
  UserX, FileSpreadsheet
} from 'lucide-vue-next'
import { students, courses } from '../stores/data'

const active = computed(
  () => students.value.filter(s => s.status === 'Active').length
)

const inactive = computed(
  () => students.value.length - active.value
)

const distribution = computed(() =>
  courses.value
    .map((c, i) => {
      const count = students.value.filter(
        s => s.course === c.code
      ).length

      return {
        ...c,
        count,
        percent: students.value.length
          ? Math.round(count / students.value.length * 100)
          : 0,
        color: i % 4
      }
    })
    .sort((a, b) => b.count - a.count)
)

function exportCsv() {
  const rows = [
    [
      'Student No.',
      'First Name',
      'Last Name',
      'Email',
      'Course',
      'Year Level',
      'Status'
    ],
    ...students.value.map(s => [
      s.studentNo,
      s.firstName,
      s.lastName,
      s.email,
      s.course,
      s.yearLevel,
      s.status
    ])
  ]

  const csv = rows
    .map(row =>
      row.map(value =>
        '"' + String(value ?? '').replaceAll('"', '""') + '"'
      ).join(',')
    )
    .join('\r\n')

  const url = URL.createObjectURL(
    new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;'
    })
  )

  const a = document.createElement('a')
  a.href = url
  a.download = 'student-information-report.csv'
  a.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="section-kicker">ANALYTICS</div>
      <h1>Reports</h1>
      <p>
        A quick summary of student enrollment and academic programs.
      </p>
    </div>

    <button class="btn btn-primary" @click="exportCsv">
      <Download :size="17" /> Export student CSV
    </button>
  </div>

  <section class="report-stat-grid">
    <div class="report-stat">
      <span class="report-icon icon-blue"><Users :size="20" /></span>
      <div>
        <small>Total students</small>
        <strong>{{ students.length }}</strong>
        <span>Records in directory</span>
      </div>
    </div>

    <div class="report-stat">
      <span class="report-icon icon-green"><UserCheck :size="20" /></span>
      <div>
        <small>Active students</small>
        <strong>{{ active }}</strong>
        <span>
          {{ students.length
            ? Math.round(active / students.length * 100)
            : 0 }}% of all records
        </span>
      </div>
    </div>

    <div class="report-stat">
      <span class="report-icon icon-orange"><UserX :size="20" /></span>
      <div>
        <small>Inactive students</small>
        <strong>{{ inactive }}</strong>
        <span>
          {{ students.length
            ? Math.round(inactive / students.length * 100)
            : 0 }}% of all records
        </span>
      </div>
    </div>

    <div class="report-stat">
      <span class="report-icon icon-purple"><BookOpen :size="20" /></span>
      <div>
        <small>Courses listed</small>
        <strong>{{ courses.length }}</strong>
        <span>Academic programs</span>
      </div>
    </div>
  </section>

  <section class="report-grid">
    <div class="panel report-panel">
      <div class="panel-heading">
        <div>
          <h2>Students by course</h2>
          <p>Distribution across registered programs</p>
        </div>
        <BookOpen :size="18" class="muted-icon" />
      </div>

      <div v-if="distribution.length" class="report-bars">
        <div
          v-for="c in distribution"
          :key="c.id"
          class="report-bar-row"
        >
          <div class="report-bar-head">
            <span>
              <i :class="'bar-dot bar-' + c.color"></i>
              <b>{{ c.code }}</b>
              <small>{{ c.name }}</small>
            </span>

            <strong>
              {{ c.count }}
              <small>({{ c.percent }}%)</small>
            </strong>
          </div>

          <div class="bar-track report-track">
            <div
              class="bar-fill"
              :class="'bar-' + c.color"
              :style="{ width: c.percent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        No courses available yet.
      </div>
    </div>

    <div class="panel report-panel">
      <div class="panel-heading">
        <div>
          <h2>Enrollment status</h2>
          <p>Active compared with inactive records</p>
        </div>
        <Users :size="18" class="muted-icon" />
      </div>

      <div class="status-overview">
        <div
          class="status-ring"
          :style="{
            '--active-percent': (
              students.length
                ? active / students.length * 100
                : 0
            ) + '%'
          }"
        >
          <div>
            <strong>{{ students.length }}</strong>
            <small>Students</small>
          </div>
        </div>

        <div class="status-legend">
          <div>
            <i class="legend-dot legend-active"></i>
            <span>
              <b>Active</b>
              <small>Currently enrolled</small>
            </span>
            <strong>{{ active }}</strong>
          </div>

          <div>
            <i class="legend-dot legend-inactive"></i>
            <span>
              <b>Inactive</b>
              <small>Not currently enrolled</small>
            </span>
            <strong>{{ inactive }}</strong>
          </div>
        </div>
      </div>

      <div class="report-note">
        <span class="note-check">✓</span>
        <span>
          <b>Report is up to date</b>
          <small>
            Summaries update automatically when records change.
          </small>
        </span>
      </div>
    </div>
  </section>

  <section class="panel export-panel">
    <div class="export-icon">
      <FileSpreadsheet :size="23" />
    </div>

    <div>
      <h2>Need to work with the data elsewhere?</h2>
      <p>
        Export the student directory as a CSV file that opens in
        Excel or Google Sheets.
      </p>
    </div>

    <button class="btn btn-white" @click="exportCsv">
      <Download :size="16" /> Download CSV
    </button>
  </section>
</template>
