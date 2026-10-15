
<script setup>
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  Users,
  BookOpen,
  ShieldCheck,
  Zap,
  CheckCircle2,
  GraduationCap,
  ChartNoAxesCombined
} from 'lucide-vue-next'
import { students, courses } from '../stores/data'
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">
          <span class="eyebrow-dot"></span>
          YOUR CAMPUS, CONNECTED
        </div>

        <h1>
          Every student.<br />
          <span>One smart system.</span>
        </h1>

        <p class="hero-description">
          A simpler way to organize student information,
          manage courses, and understand your campus at a glance.
        </p>

        <div class="hero-buttons">
          <RouterLink to="/dashboard" class="btn btn-primary">
            Explore dashboard <ArrowRight :size="17" />
          </RouterLink>

          <RouterLink to="/students" class="btn btn-white">
            Manage students
          </RouterLink>
        </div>

        <div class="hero-proof">
          <div class="proof-avatars">
            <span>MS</span>
            <span>JR</span>
            <span>AC</span>
            <span>+</span>
          </div>

          <div>
            <strong>Made for campus teams</strong>
            <small>Simple, clear, and organized</small>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="visual-glow"></div>

        <div class="mock-window">
          <div class="mock-top">
            <span class="mock-logo">
              <GraduationCap :size="16" />
            </span>

            <div>
              <b>Campus overview</b>
              <small>Welcome back, Admin</small>
            </div>

            <span class="mock-status">Live demo</span>
          </div>

          <div class="mock-stat-row">
            <div class="mock-stat">
              <span>Total students</span>
              <strong>{{ students.length }}</strong>
              <small>Student records</small>
            </div>

            <div class="mock-stat">
              <span>Courses</span>
              <strong>{{ courses.length }}</strong>
              <small>Programs listed</small>
            </div>
          </div>

          <div class="mock-chart-title">
            <b>Student directory</b>
            <span>Latest records</span>
          </div>

          <div
            v-for="(s, i) in students.slice(0, 3)"
            :key="s.id"
            class="mock-student"
          >
            <div class="mock-person" :class="'person-' + i">
              {{ s.firstName[0] + s.lastName[0] }}
            </div>

            <div class="mock-student-name">
              <b>{{ s.firstName }} {{ s.lastName }}</b>
              <small>{{ s.studentNo }} · {{ s.course }}</small>
            </div>

            <span
              class="status-pill"
              :class="s.status === 'Active'
                ? 'status-active'
                : 'status-inactive'"
            >
              {{ s.status }}
            </span>
          </div>
        </div>

        <div class="float-card float-check">
          <CheckCircle2 :size="18" />
          <span>
            <b>Records organized</b>
            <small>All in one place</small>
          </span>
        </div>

        <div class="float-card float-shield">
          <ShieldCheck :size="21" />
        </div>
      </div>
    </section>

    <section class="welcome-row">
      <div>
        <div class="section-kicker">WELCOME TO CAMPUSCORE</div>
        <h2>Everything you need to manage student records.</h2>
        <p>
          Spend less time organizing files and more time supporting students.
        </p>
      </div>

      <RouterLink to="/students" class="text-link">
        Open student directory <ArrowRight :size="16" />
      </RouterLink>
    </section>

    <section class="feature-grid">
      <RouterLink to="/students" class="feature-card">
        <div class="feature-icon icon-blue">
          <Users :size="22" />
        </div>
        <div class="feature-meta">01 / RECORDS</div>
        <h3>Student management</h3>
        <p>
          Add new students, update details, search records,
          and remove outdated entries.
        </p>
        <span class="feature-link">
          Manage students <ArrowRight :size="16" />
        </span>
      </RouterLink>

      <RouterLink to="/courses" class="feature-card">
        <div class="feature-icon icon-purple">
          <BookOpen :size="22" />
        </div>
        <div class="feature-meta">02 / PROGRAMS</div>
        <h3>Course directory</h3>
        <p>
          Keep your academic programs and departments organized
          in one place.
        </p>
        <span class="feature-link">
          Explore courses <ArrowRight :size="16" />
        </span>
      </RouterLink>

      <RouterLink to="/reports" class="feature-card">
        <div class="feature-icon icon-green">
          <ChartNoAxesCombined :size="22" />
        </div>
        <div class="feature-meta">03 / INSIGHTS</div>
        <h3>Reports &amp; insights</h3>
        <p>
          Review student status, compare course counts,
          and export your records.
        </p>
        <span class="feature-link">
          View reports <ArrowRight :size="16" />
        </span>
      </RouterLink>
    </section>

    <section class="bottom-banner">
      <div class="banner-symbol">
        <Zap :size="22" />
      </div>

      <div>
        <h3>Ready to get started?</h3>
        <p>
          Visit your dashboard to see a snapshot of your student information.
        </p>
      </div>

      <RouterLink to="/dashboard" class="btn btn-dark">
        Go to dashboard <ArrowRight :size="16" />
      </RouterLink>
    </section>
  </div>
</template>
