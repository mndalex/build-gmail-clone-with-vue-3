<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read && 'read']"
        @click="openEmail(email)"
      >
        <td><input type="checkbox" /></td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td class="date">{{ formatDate(email.sentAt) }}</td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" />
  </ModalView>
</template>

<script>
import { format } from 'date-fns';
import { ref } from 'vue';
import axios from 'axios';
import MailView from '@/components/MailView.vue';
import ModalView from '@/components/ModalView.vue';

export default {
  components: {
    MailView,
    ModalView,
  },
  async setup() {
    const { data: emails } = await axios.get('http://localhost:3000/emails');

    return {
      emails: ref(emails),
      openedEmail: ref(null),
    };
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), 'MMM do yyyy');
    },
    openEmail(email) {
      email.read = true;
      this.openedEmail = email;
      console.log(this.openedEmail);
      this.updateEmail(email);
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    },
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((email1, email2) => {
        return email1.sentAt < email2.sentAt;
      });
    },
    unarchivedEmails() {
      return this.sortedEmails.filter(email => !email.archived);
    },
  },
};
</script>

<style scoped></style>
