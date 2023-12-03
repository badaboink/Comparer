// project imports
import { MADE_BY } from '../../../apiUrls';


// mui imports
// import { useTheme } from '@mui/material/styles';
import {
    Stack,
    Chip,
    IconButton,
} from '@mui/material';
import { IconShare } from '@tabler/icons';

const Footer = () => {
    return (
        <Stack direction="row" justifyContent="space-between">
        <Chip
                disabled
                size="medium"
                label={MADE_BY}
                sx={{
                cursor: 'pointer',
                '& .MuiChip-label': {
                    fontSize: '0.65rem',
                    color: 'black',
                },
                }}
            />
            <a
                href="https://www.linkedin.com/in/eglė-janušaitytė"
                target="_blank"
                rel="noopener noreferrer"
            >
                <IconButton aria-label="share">
                <IconShare stroke={2} size="1rem" opacity={0.6} />
                </IconButton>
            </a>
         </Stack>
    );
};

export default Footer;