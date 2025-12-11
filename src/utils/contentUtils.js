export const copyToClipboard = async (content) => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    throw new Error('Failed to copy to clipboard');
  }
};

export const downloadContent = (content, topic) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `blog-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

