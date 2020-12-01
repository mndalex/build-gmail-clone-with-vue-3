import { reactive } from 'vue';

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

  return {
    emails,
    toggle,
    clear,
    addMultiple,
  };
};

export default useEmailSelection;
