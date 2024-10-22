// Helper function to clean up HTML content
export const CleanMarkAiContent = (htmlContent) => {
  let cleanedContent = htmlContent;

  // // 1. Remove <mark> tags with 'lightcoral' or #F08080 background and their content
  cleanedContent = cleanedContent.replace(
    /<mark\b(?=[^>]*\bstyle=["'][^"']*background-color\s*:\s*(?:#F08080|lightcoral)[^"']*["'])[^>]*>[\s\S]*?<\/mark>/gi,
    ''
  );
  // Remove only the closing </mark> tags, retain the default <mark>
  cleanedContent = cleanedContent.replace(/<mark>(.*?)<\/mark>/gi, '$1');

  // 2. Remove <mark> and </mark> tags but retain the content inside them (for yellow marks)

  // 3. Remove newline characters
  cleanedContent = cleanedContent.replace(/\n/g, '');

  // 4. Remove any instances of '**'
  cleanedContent = cleanedContent.replace(/\*\*/g, '');

  // 5. Remove any instances of '```html'
  cleanedContent = cleanedContent.replace(/```html/g, '');

  // 5. Remove any instances of '```html'
  cleanedContent = cleanedContent.replace(/```/g, '');

  return cleanedContent;
};

export default CleanMarkAiContent;
