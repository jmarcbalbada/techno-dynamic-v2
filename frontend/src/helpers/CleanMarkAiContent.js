// Helper function to clean up HTML content
export const CleanMarkAiContent = (htmlContent) => {
  let cleanedContent = htmlContent;

  // 1. Remove <mark> tags with 'lightcoral' background and their content
  cleanedContent = cleanedContent.replace(
    /<mark\s+style\s*=\s*"background-color\s*:\s*lightcoral\s*;">.*?<\/mark>/gi,
    ''
  );

  // 2. Remove <mark> and </mark> tags but retain the content inside them (for yellow marks)
  cleanedContent = cleanedContent.replace(/<\/?mark(?:\s+[^>]+)?>/gi, '');

  // 3. Remove newline characters
  cleanedContent = cleanedContent.replace(/\n/g, '');

  // 4. Remove any instances of '**'
  cleanedContent = cleanedContent.replace(/\*\*/g, '');

  // 5. Remove any instances of '```html'
  cleanedContent = cleanedContent.replace(/```html/g, '');

  return cleanedContent;
};

export default CleanMarkAiContent;
