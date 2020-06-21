import React, { useState, FunctionComponent } from 'react';

// Misc
import * as authorAPI from '../../../../api/authorAPI';

// Interface
import { Author, AuthorInput } from '../../../../interfaces/author';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditAuthorProps {
  authorToEdit: Author | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditAuthor: FunctionComponent<IDialogAddOrEditAuthorProps> = (props) => {
  const [authorInput, setAuthorInput] = useState<AuthorInput>({ name: '', about: '', PhotoURL: '' });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.authorToEdit) {
      setAuthorInput({ name: '', about: '', PhotoURL: '' });
    } else {
      	setAuthorInput({ 
			name: props.authorToEdit.name,
			about: props.authorToEdit.about,
			PhotoURL: props.authorToEdit.PhotoURL
		});
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.authorToEdit) {
      authorAPI.addAuthor(authorInput)
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
      authorAPI.updateAuthor(props.authorToEdit.id, authorInput)
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
      <DialogTitle id="form-dialog-title">{!props.authorToEdit ? `Add Author` : `Edit Author: ${props.authorToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill these fields below to continue.
        </DialogContentText>
        <TextField
          required
          id="outlined-full-width"
          label="Author name"
          style={{ margin: 8 }}
          placeholder="Shakespeare"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={authorInput.name}
          onChange={(event) => {setAuthorInput({...authorInput, name: event.target.value })}}
        />
        <TextField
          required
          id="outlined-full-width"
          label="About Author"
          style={{ margin: 8 }}
          placeholder="British"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={authorInput.about}
          onChange={(event) => {setAuthorInput({...authorInput, about: event.target.value })}}
        />
        <TextField
          required
          id="outlined-full-width"
          label="Author Photo"
          style={{ margin: 8 }}
          placeholder="https://www.google.com"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={authorInput.PhotoURL}
          onChange={(event) => {setAuthorInput({...authorInput, PhotoURL: event.target.value })}}
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

export default DialogAddOrEditAuthor;