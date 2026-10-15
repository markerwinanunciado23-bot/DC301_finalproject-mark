<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Users, BookOpen, UserCheck, UserX,
  ArrowUpRight, Plus, ArrowRight
} from 'lucide-vue-next'
import { students, courses } from '../stores/data'

const active = computed(
  () => students.value.filter(s => s.status === 'Active').length
)

const inactive = computed(
  () => students.value.filter(s => s.status !== 'Active').length
)

const latest = computed(
  () => [...students.value].slice(-5).reverse()
)

const courseCounts = computed(() =>
  courses.value
    .map(c => ({
      ...c,
      count: students.value.filter(s => s.course === c.code).length
    }))
    .sort((a, b) => b.count - a.count)
)
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="section-kicker">OVERVIEW</div>
      <h1>Dashboard</h1>
      <p>Here's what's happening with your student records today.</p>
    </div>

    <RouterLink to="/students" class="btn btn-primary">
      <Plus :size="17" /> Add student
    </RouterLink>
  </div>

  <section class="stat-grid">
    <div class="stat-card">
      <div class="stat-top">
        <span>Total students</span>
        <span class="stat-icon icon-blue"><Users :size="19" /></span>
      </div>
      <strong class="stat-number">{{ students.length }}</strong>
      <div class="stat-foot">
        <span class="stat-foot-dot"></span>
        All student records
        <RouterLink to="/students" class="stat-foot-right">
          View list <ArrowUpRight :size="13" />
        </RouterLink>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-top">
        <span>Active students</span>
        <span class="stat-icon icon-green"><UserCheck :size="19" /></span>
      </div>
      <strong class="stat-number">{{ active }}</strong>
      <div class="stat-foot">
        <span class="mini-green">●</span> Currently enrolled
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-top">
        <span>Inactive students</span>
        <span class="stat-icon icon-orange"><UserX :size="19" /></span>
      </div>
      <strong class="stat-number">{{ inactive }}</strong>
      <div class="stat-foot">
        <span class="mini-orange">●</span> Needs review
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-top">
        <span>Courses</span>
        <span class="stat-icon icon-purple"><BookOpen :size="19" /></span>
      </div>
      <strong class="stat-number">{{ courses.length }}</strong>
      <div class="stat-foot">
        Academic programs
        <RouterLink to="/courses" class="stat-foot-right">
          View courses <ArrowUpRight :size="13" />
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="dashboard-grid">
    <div class="panel">
      <div class="panel-heading">
        <div>
          <h2>Recently added students</h2>
          <p>Your latest student records</p>
        </div>
        <RouterLink to="/students" class="small-link">
          View all <ArrowRight :size="14" />
        </RouterLink>
      </div>

      <div v-if="latest.length" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>STUDENT NO.</th>
              <th>COURSE</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="s in latest" :key="s.id">
              <td>
                <div class="person-cell">
                  <span class="table-avatar">
                    {{ s.firstName[0] }}{{ s.lastName[0] }}
                  </span>
                  <span>
                    <b>{{ s.firstName }} {{ s.lastName }}</b>
                    <small>{{ s.email }}</small>
                  </span>
                </div>
              </td>
              <td>{{ s.studentNo }}</td>
              <td><span class="course-chip">{{ s.course }}</span></td>
              <td>
                <span
                  class="status-pill"
                  :class="s.status === 'Active'
                    ? 'status-active'
                    : 'status-inactive'"
                >
                  {{ s.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <Users :size="28" />
        <p>No student records yet.</p>
        <RouterLink to="/students">Add your first student</RouterLink>
      </div>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <div>
          <h2>Students by course</h2>
          <p>Enrollment overview</p>
        </div>
        <BookOpen :size="18" class="muted-icon" />
      </div>

      <div v-if="courseCounts.length" class="course-bars">
        <div
          v-for="(c, i) in courseCounts"
          :key="c.id"
          class="course-bar-item"
        >
          <div class="bar-label">
            <span>
              <i :class="'bar-dot bar-' + (i % 4)"></i>
              {{ c.code }}
            </span>
            <b>{{ c.count }}</b>
          </div>

          <div class="bar-track">
            <div
              class="bar-fill"
              :class="'bar-' + (i % 4)"
              :style="{
                width: students.length
                  ? Math.max(
                      c.count / students.length * 100,
                      c.count ? 7 : 0
                    ) + '%'
                  : '0%'
              }"
            ></div>
          </div>

          <small>{{ c.name }}</small>
        </div>
      </div>

      <div v-else class="empty-state">
        No courses have been added.
      </div>

      <RouterLink to="/courses" class="panel-bottom-link">
        Manage courses <ArrowRight :size="15" />
      </RouterLink>
    </div>
  </section>

  <section class="quick-actions">
    <div>
      <h2>Quick actions</h2>
      <p>Common tasks, right at your fingertips.</p>
    </div>

    <div class="quick-action-list">
      <RouterLink to="/students" class="quick-action">
        <span class="quick-icon icon-blue"><Users :size="18" /></span>
        <span>
          <b>Add or edit students</b>
          <small>Manage personal and academic details</small>
        </span>
        <ArrowRight :size="17" />
      </RouterLink>

      <RouterLink to="/courses" class="quick-action">
        <span class="quick-icon icon-purple"><BookOpen :size="18" /></span>
        <span>
          <b>Manage courses</b>
          <small>Update programs and departments</small>
        </span>
        <ArrowRight :size="17" />
      </RouterLink>
    </div>
  </section>
</template>
