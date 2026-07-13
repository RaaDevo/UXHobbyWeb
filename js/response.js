document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const fields = ['name', 'email', 'experience', 'genre', 'technique', 'equipment', 'plan', 'consent'];
  const values = Object.fromEntries(fields.map((field) => [field, (params.get(field) || '').trim()]));
  const hasSubmission = fields.every((field) => values[field]);
  const title = document.getElementById('response-title');
  const message = document.getElementById('response-message');
  const summary = document.getElementById('submission-summary');
  const missing = document.getElementById('missing-submission');

  if (!hasSubmission) {
    title.textContent = 'No photography challenge submission found';
    message.textContent = 'No photography challenge submission was found. Please return to the Showcase page and complete the form.';
    summary.hidden = true;
    missing.hidden = false;
    return;
  }

  title.textContent = 'Photography Challenge Accepted!';
  message.textContent = `Thank you, ${values.name}. Your photography challenge has been recorded.`;
  fields.forEach((field) => {
    const target = document.getElementById(`${field}-value`);
    if (target) target.textContent = values[field];
  });
  summary.hidden = false;
  missing.hidden = true;
});
