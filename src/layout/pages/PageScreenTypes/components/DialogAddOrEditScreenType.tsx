import React, { useState, FunctionComponent } from 'react';

// Misc
import * as screenTypeAPI from '../../../../api/screenTypeAPI';

// Interface
import { ScreenType, ScreenTypeInput } from '../../../../interfaces/screenType';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditScreenTypeProps {
  screenTypeToEdit: ScreenType | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditScreenType: FunctionComponent<IDialogAddOrEditScreenTypeProps> = (props) => {
  const [screenTypeInput, setScreenTypeInput] = useState<ScreenTypeInput>({ name: '' });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.screenTypeToEdit) {
      setScreenTypeInput({ name: '' });
    } else {
      setScreenTypeInput({ name: props.screenTypeToEdit.name });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.screenTypeToEdit) {
      // Add ScreenType
      screenTypeAPI.addScreenType(screenTypeInput)
        .then(response => {
          setIsLoadingSave(false);
          console.log(response);
          props.onSave();
        })
        .catch(err => {
          setIsLoadingSave(false);
          console.log(err);
        })
    } else {
      // Update ScreenType
      screenTypeAPI.updateScreenType(props.screenTypeToEdit.id, screenTypeInput)
        .then(response => {
          setIsLoadingSave(false);
          console.log(response);
          props.onSave();
        })
        .catch(err => {
          setIsLoadingSave(false);
          console.log(err);
        })
    }
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">{!props.screenTypeToEdit ? `Add ScreenType` : `Edit ScreenType: ${props.screenTypeToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <TextField
          required
          id="outlined-full-width"
          label="ScreenType name"
          style={{ margin: 8 }}
          placeholder="Sci-Fi"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={screenTypeInput.name}
          onChange={(event) => {setScreenTypeInput({...screenTypeInput, name: event.target.value })}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onDialogClose()} color="primary">
          Cancel
        </Button>
        <div style={{position: 'relative'}}>
          {/* Extra <div> is for loading */}
          <Button onClick={() => onDialogSave()} color="primary" variant="contained" disabled={isLoadingSave}>
            Save
          </Button>
          {isLoadingSave ? <CircularProgress size={24} className="circular-center-size-24px" /> : null}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default DialogAddOrEditScreenType;