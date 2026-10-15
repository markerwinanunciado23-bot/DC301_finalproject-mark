
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  ChartNoAxesCombined,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown
} from 'lucide-vue-next'

const route = useRoute()
const menuOpen = ref(false)

const nav = [
  { label: 'Home', to: '/', icon: GraduationCap },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/students', icon: Users },
  { label: 'Courses', to: '/courses', icon: BookOpen },
  { label: 'Reports', to: '/reports', icon: ChartNoAxesCombined }
]

const pageName = computed(
  () => nav.find(item => item.to === route.path)?.label
    || 'Student Information System'
)
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <RouterLink
        to="/"
        class="brand"
        @click="menuOpen = false"
      >
        <span class="brand-mark">
          <GraduationCap :size="25" />
        </span>

        <span>
          <strong>Campus<span class="brand-light">Core</span></strong>
          <small>STUDENT PORTAL</small>
        </span>
      </RouterLink>

      <div class="nav-caption">WORKSPACE</div>

      <nav class="main-nav">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: route.path === item.to }"
          @click="menuOpen = false"
        >
          <component :is="item.icon" :size="19" />
          <span>{{ item.label }}</span>
          <span
            v-if="item.to === '/students'"
            class="nav-dot"
          ></span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="help-card">
          <div class="help-icon">
            <BookOpen :size="18" />
          </div>

          <strong>Need a hand?</strong>
          <p>
            Manage student records and keep your campus organized.
          </p>

          <RouterLink
            to="/reports"
            @click="menuOpen = false"
          >
            View reports <span>→</span>
          </RouterLink>
        </div>

        <div class="profile-mini">
          <div class="avatar">AD</div>
          <div class="profile-copy">
            <strong>Campus Admin</strong>
            <small>Administrator</small>
          </div>
          <ChevronDown :size="16" />
        </div>
      </div>
    </aside>

    <div
      v-if="menuOpen"
      class="mobile-overlay"
      @click="menuOpen = false"
    ></div>

    <main class="main-area">
      <header class="topbar">
        <button
          class="icon-button mobile-menu"
          aria-label="Open menu"
          @click="menuOpen = !menuOpen"
        >
          <component :is="menuOpen ? X : Menu" :size="21" />
        </button>

        <div class="breadcrumbs">
          <span>Workspace</span>
          <span class="crumb-slash">/</span>
          <strong>{{ pageName }}</strong>
        </div>

        <div class="top-actions">
          <div class="top-search">
            <Search :size="16" />
            <span>Student Information System</span>
            <kbd>SPA</kbd>
          </div>

          <button
            class="icon-button notification"
            aria-label="Notifications"
          >
            <Bell :size="19" />
            <i></i>
          </button>

          <div class="top-avatar">AD</div>
        </div>
      </header>

      <div class="page-content">
        <RouterView />
      </div>

      <footer class="footer">
        <span>© 2026 CampusCore Student Information System</span>
        <span>Built with Vue 3 <span class="footer-heart">♥</span></span>
      </footer>
    </main>
  </div>
</template>
