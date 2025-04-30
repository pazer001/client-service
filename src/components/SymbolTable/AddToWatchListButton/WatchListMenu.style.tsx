import { Typography, TypographyProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const ListTitleStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  paddingInline: theme.spacing(1),
  paddingTop: theme.spacing(1),
}))

export const ListTitle = ({ children, ...rest }: TypographyProps) => {
  return (
    <ListTitleStyled variant="h6" {...rest}>
      {children}
    </ListTitleStyled>
  )
}
