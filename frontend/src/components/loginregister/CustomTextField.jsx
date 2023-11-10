import { TextField, styled } from "@mui/material";

export const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.textfield.main
    },
    '&:hover fieldset': {
      borderColor: theme.palette.textfield.main
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.textfield.main
    }
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: theme.palette.textfield.main,
  },
}));