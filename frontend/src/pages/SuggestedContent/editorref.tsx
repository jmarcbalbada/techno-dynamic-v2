// // @ts-nocheck
// import React from 'react';

// export interface EditorRef {
//   getHTMLContent: () => string;
//   // Add other methods or properties if needed
// }

import React, { useState, useImperativeHandle, forwardRef } from 'react';

// Define the EditorRef interface
export interface EditorRef {
  getHTMLContent: () => string;
}

// Create the Editor component with forwardRef and expose getHTMLContent method
const Editor = forwardRef<EditorRef, { contents: string }>(
  ({ contents }, ref) => {
    const [htmlContent, setHtmlContent] = useState(contents);

    // Use useImperativeHandle to expose getHTMLContent to the parent component
    useImperativeHandle(ref, () => ({
      getHTMLContent() {
        return htmlContent; // Return the current HTML content
      }
    }));

    // Example function to handle content change
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHtmlContent(e.target.value);
    };

    return (
      <textarea
        value={htmlContent}
        onChange={handleContentChange}
        rows={10}
        cols={50}
      />
    );
  }
);

export default Editor;
