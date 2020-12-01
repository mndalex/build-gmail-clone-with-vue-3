import { reactive } from 'vue';
import axios from 'axios';

let emails = reactive(new Set());

export const useEmailSelection = function() {
  const toggle = function(email) {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  const clear = () => {
    emails.clear();
  };

  const addMultiple = newEmails => {
    newEmails.forEach(email => emails.add(email));
  };

  const forSelected = fn => {
    emails.forEach(email => {
      fn(email);
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    });
  };

  const markRead = () => forSelected(e => (e.read = true));
  const markUnread = () => forSelected(e => (e.read = false));
  const toggleArchive = () => {
    forSelected(e => (e.archived = !e.archived));
    emails.clear();
  };

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    toggleArchive,
  };
};

export default useEmailSelection;
