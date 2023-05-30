import React from 'react'
import { Paper, TextField, Button } from '@mui/material'
import './EditorPage.css'

export const ContentSlide = ( { slideNum, contentSlideHandler, slideContent }) => {
  return (
    <Paper elevation={16} sx={{
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        }}>

        <div className="lesson-editor-content">
            <span>Content:</span>
        </div>

        <TextField
            onChange={(e) => contentSlideHandler(e, slideNum - 1)}
            value={slideContent}
            size="large"
            placeholder="Write Something..."
            multiline
            rows={12}
            sx={{
                width: '70%',
            }}>
        </TextField>               

        <div className="lesson-editor-buttons">
            <Button variant="contained">Add Url</Button>
            <Button variant="contained">Add Files</Button>
        </div>

        <div className="lesson-editor-page-number">Slide {slideNum}</div>
    </Paper>
  )
}
