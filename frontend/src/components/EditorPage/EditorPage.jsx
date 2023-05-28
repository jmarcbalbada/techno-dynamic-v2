import { Container, Paper, TextField, Button } from '@mui/material'
import React from 'react'
import "./EditorPage.css"

export const EditorPage = () => {
  return (
    <Container maxWidth="md"  sx={{
        paddingTop: '2rem'             
    }}>
        <Paper sx={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        }}>
            <div className='lesson-editor-label'>
                LESSON EDITOR
            </div>
            
            <div className='lesson-editor-title'>
                <span>
                    Title:
                </span>
            </div>

            <TextField 
                size='small'
                placeholder='Enter Title Here'
                sx={{
                    width: '70%'
                }}
            >
            </TextField>

            <div className='lesson-editor-content'>
                <span>
                    Content:
                </span>
            </div>

            <TextField
                size='large'
                placeholder='Write Something...'
                multiline
                rows={12}
                sx={{
                    width: '70%'
                }}
            >
            </TextField>

            <div className='lesson-editor-buttons'>
                <Button 
                    variant='contained'
                > 
                    Add Url
                </Button>
                <Button 
                    variant='contained'
                >
                    Add Files
                </Button>
            </div>

            <div className='lesson-editor-page-number'>
                Slide 1
            </div>
        </Paper>
    </Container>
  )
}
