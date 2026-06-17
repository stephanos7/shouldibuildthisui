import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

type ClearSavedAnswersDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ClearSavedAnswersDialog({
  open,
  onClose,
  onConfirm
}: ClearSavedAnswersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Clear saved answers?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will remove your saved questionnaire answers and latest recommendation from this
          browser. You can start again immediately.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Clear saved answers
        </Button>
      </DialogActions>
    </Dialog>
  );
}
