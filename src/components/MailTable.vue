<template>
  <button :disabled="selectedScreen === 'inbox'" @click="selectScreen('inbox')">Inbox</button>
  <button :disabled="selectedScreen === 'archived'" @click="selectScreen('archived')">
    Archived
  </button>
  <bulk-action-bar :emails="filteredEmails" />
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in filteredEmails"
        :key="email.id"
        :class="['clickable', email.read && 'read']"
      >
        <td>
          <input
            @click="emailSelection.toggle(email)"
            :selected="emailSelection.emails.has(email)"
            :checked="emailSelection.emails.has(email)"
            type="checkbox"
          />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td @click="openEmail(email)" class="date">{{ formatDate(email.sentAt) }}</td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
import { format } from 'date-fns';
import { ref } from 'vue';
import axios from 'axios';
import MailView from '@/components/MailView.vue';
import ModalView from '@/components/ModalView.vue';
import useEmailSelection from '@/composables/use-email-selection';
import BulkActionBar from './BulkActionBar.vue';

export default {
  components: {
    MailView,
    ModalView,
    BulkActionBar,
  },
  async setup() {
    const { data: emails } = await axios.get('http://localhost:3000/emails');

    return {
      emails: ref(emails),
      openedEmail: ref(null),
      emailSelection: useEmailSelection(),
      selectedScreen: ref('inbox'),
    };
  },
  methods: {
    selectScreen(newScreen) {
      this.selectedScreen = newScreen;
      this.emailSelection.clear();
    },
    formatDate(date) {
      return format(new Date(date), 'MMM do yyyy');
    },
    openEmail(email) {
      this.openedEmail = email;
      if (email) {
        email.read = true;
        this.updateEmail(email);
      }
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    },
    changeEmail({ toggleRead, toggleArchive, save, closeModal, changeIndex }) {
      const email = this.openedEmail;

      if (toggleRead) {
        email.read = !email.read;
      }

      if (toggleArchive) {
        email.archived = !email.archived;
      }

      if (save) {
        this.updateEmail(email);
      }

      if (closeModal) {
        this.openedEmail = null;
      }

      if (changeIndex) {
        const emails = this.filteredEmails;
        const currentIndex = emails.indexOf(this.openedEmail);
        const newEmail = emails[currentIndex + changeIndex];
        this.openEmail(newEmail);
      }
    },
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((email1, email2) => {
        return email1.sentAt < email2.sentAt;
      });
    },
    filteredEmails() {
      if (this.selectedScreen === 'inbox') {
        return this.sortedEmails.filter(email => !email.archived);
      } else {
        return this.sortedEmails.filter(email => email.archived);
      }
    },
  },
};
</script>

<style scoped></style>
