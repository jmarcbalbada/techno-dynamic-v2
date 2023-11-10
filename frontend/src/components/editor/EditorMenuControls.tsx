import React, { useCallback } from 'react';
import { ImagesService } from '../../apis/ImagesService.js';
import { IconButton, useTheme } from '@mui/material';
import {
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonHorizontalRule,
  MenuButtonImageUpload,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontSize,
  MenuSelectHeading,
  MenuSelectTextAlign,
  isTouchDevice
} from 'mui-tiptap';

import YouTubeIcon from '@mui/icons-material/YouTube';

export default function EditorMenuControls({ rteRef }) {
  const theme = useTheme();

  // Function to insert a YouTube video
  const addYoutubeVideo = useCallback(() => {
    const youtubeUrl = prompt('Enter the YouTube video URL:');

    if (youtubeUrl === null) {
      // User cancelled, do nothing
      return;
    }

    if (youtubeUrl === '') {
      // If the URL is empty, clear the content (can adjust this behavior)
      rteRef.current?.editor
        ?.chain()
        .focus()
        .extendMarkRange('youtube')
        .clearContent()
        .run();
      return;
    }

    // Insert the YouTube video using your editor's command
    rteRef.current?.editor?.commands.setYoutubeVideo({
      src: youtubeUrl
    });
  }, [rteRef]);

  async function uploadImagesToServer(files) {
    const imageUrls = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image_link', file);

        const response = await ImagesService.upload(formData);

        if (response.status === 201) {
          imageUrls.push(response.data.image_link);
        }
      } catch (err) {
        console.log(err);
      }
    }
    return imageUrls;
  }

  return (
    <MenuControlsContainer>
      <MenuSelectHeading />

      <MenuDivider />

      <MenuSelectFontSize />

      <MenuDivider />

      <MenuButtonBold />

      <MenuButtonItalic />

      <MenuButtonUnderline />

      <MenuButtonStrikethrough />

      <MenuButtonSubscript />

      <MenuButtonSuperscript />

      <MenuDivider />

      <MenuButtonTextColor
        PopperProps={{
          disablePortal: true
        }}
        defaultTextColor={theme.palette.text.primary}
        swatchColors={[
          { value: '#000000', label: 'Black' },
          { value: '#ffffff', label: 'White' },
          { value: '#888888', label: 'Grey' },
          { value: '#ff0000', label: 'Red' },
          { value: '#ff9900', label: 'Orange' },
          { value: '#ffff00', label: 'Yellow' },
          { value: '#00d000', label: 'Green' },
          { value: '#004aad', label: 'Blue' }
        ]}
      />

      <MenuButtonHighlightColor
        PopperProps={{
          disablePortal: true
        }}
        swatchColors={[
          { value: '#595959', label: 'Dark grey' },
          { value: '#dddddd', label: 'Light grey' },
          { value: '#ffa6a6', label: 'Light red' },
          { value: '#ffd699', label: 'Light orange' },
          // Plain yellow matches the browser default `mark` like when using Cmd+Shift+H
          { value: '#ffff00', label: 'Yellow' },
          { value: '#99cc99', label: 'Light green' },
          { value: '#90c6ff', label: 'Light blue' },
          { value: '#8085e9', label: 'Light purple' }
        ]}
      />

      <MenuDivider />

      <MenuButtonEditLink />

      {/* Custom */}
      <IconButton onClick={addYoutubeVideo}>
        <YouTubeIcon />
      </IconButton>

      <MenuDivider />

      <MenuSelectTextAlign />

      <MenuDivider />

      <MenuButtonOrderedList />

      <MenuButtonBulletedList />

      <MenuButtonTaskList />

      {/* On touch devices, we'll show indent/unindent buttons, since they're
unlikely to have a keyboard that will allow for using Tab/Shift+Tab. These
buttons probably aren't necessary for keyboard users and would add extra
clutter. */}
      {isTouchDevice() && (
        <>
          <MenuButtonIndent />

          <MenuButtonUnindent />
        </>
      )}

      <MenuDivider />

      <MenuButtonBlockquote />

      <MenuDivider />

      <MenuButtonCode />

      <MenuButtonCodeBlock />

      <MenuDivider />

      <MenuButtonImageUpload
        onUploadFiles={async (files) => {
          try {
            const imageUrls = await uploadImagesToServer(files);
            return imageUrls.map((url) => ({ src: url }));
          } catch (err) {
            console.log(err);
            return [];
          }
        }}
      />

      {/* <MenuDivider /> */}

      <MenuButtonHorizontalRule />

      <MenuButtonAddTable />

      <MenuDivider />

      <MenuButtonRemoveFormatting />

      <MenuDivider />

      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
}
