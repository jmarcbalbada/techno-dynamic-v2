import React, { useState, useImperativeHandle, forwardRef } from 'react';

// Define the EditorRef interface
export interface EditorRef {
  getHTMLContent: () => string;
}

// Create the Editor component with forwardRef and expose getHTMLContent method
const Editor = forwardRef<EditorRef, { contents: string }>(
  ({ contents }, ref) => {
    console.log('Received contents:', contents); // Log the received contents

    const [htmlContent, setHtmlContent] = useState(() =>
      contents.replace(/<!-- delimiter -->/g, '&lt;!-- delimiter --&gt;')
    );

    useImperativeHandle(ref, () => ({
      getHTMLContent() {
        // Unescape comment when getting HTML content
        return htmlContent.replace(
          /&lt;!-- delimiter --&gt;/g,
          '<!-- delimiter -->'
        );
      }
    }));

    // Example function to handle content change
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const updatedContent = e.target.value.replace(
        /<!-- delimiter -->/g,
        '&lt;!-- delimiter --&gt;'
      );
      setHtmlContent(updatedContent);
    };

    return (
      <textarea
        value={htmlContent.replace(
          /&lt;!-- delimiter --&gt;/g,
          '<!-- delimiter -->'
        )}
        onChange={handleContentChange}
        rows={10}
        cols={50}
      />
    );
  }
);

export default Editor;
