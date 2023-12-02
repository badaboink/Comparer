import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography
} from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onDeleteConfirmed }) => {
  const handleConfirm = () => {
    onDeleteConfirmed();
    onClose();
  };

  return (
    <center>
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <Typography padding="1rem" variant="h4">Confirm Delete</Typography>
      <DialogContent>
      <Typography variant="body2">Are you sure you want to delete?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </center>
  );
};

export default DeleteConfirmationModal;